import Knex from 'knex';
import { Practice, Tag, Video } from '../../types';
import hri from '../lib/hrids';
import { withKnex } from './postgres';
import { AppError } from './restful';
import { durationToTimeRange, splitShuffle } from './utils';

const generateKey = () => hri.random();

const mapRowToRecord = (row: any): Video => {
  return {
    videoId: row.video_id,
    channelId: row.channel_id,
    title: row.title,
    images: row.images,
    likeCount: row.like_count,
    viewCount: row.view_count,
    duration: row.duration,
    likePercentage: row.like_perc,
    tags: row.tags,
  };
};

const queryVideos = async (knex: Knex, selectedTags: string[], duration: number) => {
  const r = durationToTimeRange(duration);
  const query = knex('videos_view')
    .select('*')
    .whereNotNull('tags')
    .whereRaw(`((cardinality(?::varchar[]) = 0) OR (tags && ?::varchar[]))`, [selectedTags, selectedTags])
    .whereBetween('duration', [r.min, r.max])
    .orderByRaw('view_count * like_perc DESC');
  const results = await query;
  return results.map(mapRowToRecord);
};

export const getVideos = async (
  selectedTags: string[] = [],
  duration: number,
  limit: number = 48,
): Promise<{ items: Video[]; total: number }> => {
  return withKnex('yoga', async (knex) => {
    const videos = await queryVideos(knex, selectedTags, duration);
    return {
      items: splitShuffle(videos, 6).slice(0, limit),
      total: videos.length,
    };
  });
};

export const getTags = async (): Promise<Tag[]> => {
  return withKnex('yoga', async (knex) => {
    const results = await knex('tags').select(['name', 'group']).orderBy('name');
    return results.map(({ name, group }) => ({ name, group }));
  });
};

export const createPractice = async (selectedTags: string[], duration: number) => {
  return withKnex<Partial<Practice>>('yoga', async (knex: Knex) => {
    const videos = await queryVideos(knex, selectedTags, duration);
    if (videos.length < 30) throw new AppError(400, 'Insufficient content, please select more tags.');
    // HACK: fix this properly at some point
    const keyOptions = [generateKey(), generateKey(), generateKey(), generateKey(), generateKey()];
    const usedKeys = await knex('schedules').select(['key']).whereIn('key', keyOptions);
    const usedKeysValues = usedKeys.map((uk) => uk.key);
    const key = keyOptions.find((ko) => usedKeysValues.indexOf(ko) < 0);
    const playlist = splitShuffle(videos.slice(0, 300), 4);
    const [result] = await knex('schedules')
      .insert({
        key,
        playlist: playlist.map((v) => v.videoId),
        tags: selectedTags,
        duration,
      })
      .returning(['key', 'playlist', 'created_at', 'duration']);
    return {
      key: result.key,
      playlistLength: result.playlist.length,
      created: new Date(result.created_at).getTime(),
      tags: selectedTags,
      duration: result.duration,
    };
  });
};

export const getPracticePlaylist = async (key: string) => {
  return withKnex<Video[]>('yoga', async (knex: Knex) => {
    const { rows } = await knex.raw(
      `select vv.*
      from videos_view vv
      join videos v on v.video_id = vv.video_id
      join schedules s on vv.video_id = ANY (s.playlist)
      JOIN LATERAL unnest(s.playlist) WITH ORDINALITY AS a(elem, nr) ON elem = vv.video_id
      where s.key = ? and v.deleted is null
      ORDER BY a.nr;`,
      [key],
    );
    return rows.map(mapRowToRecord);
  });
};

export const searchVideos = (query) => {
  return withKnex<Video[]>('yoga', async (knex: Knex) => {
    const { rows } = await knex.raw(
      `select * from videos_view vv
      where vv.video_id in (
        SELECT video_id
        FROM videos, plainto_tsquery(?) AS q
        WHERE (tsv @@ q)
        )
        and vv.tags is not null
        and duration > 4
        order by vv.like_count * vv.like_perc desc ;`,
      [query],
    );
    const items = rows.slice(0, 48).map(mapRowToRecord);
    return {
      items,
      total: rows.length,
    };
  });
};

export const addFeedback = async (videoId: string, key: string, rate: number, position: number) => {
  return withKnex('yoga', async (knex: Knex) => {
    return knex('feedback').insert({
      video_id: videoId,
      rate,
      schedule_key: key,
      position,
    });
  });
};
