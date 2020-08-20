import Knex from 'knex';
import { Tag, Video } from '../../types';
import { durationToTimeRange } from './utils';
import { withKnex } from './withKnex';

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

const queryVideos = async (knex: Knex, selectedTags: string[], duration: number, limit: number = 100) => {
  const r = durationToTimeRange(duration);
  const query = knex('videos_view')
    .select('*')
    .whereNotNull('tags')
    .whereRaw(`((cardinality(?::varchar[]) = 0) OR (tags && ?::varchar[]))`, [selectedTags, selectedTags])
    .whereBetween('duration', [r.min, r.max])
    .orderByRaw('view_count * like_perc DESC')
    .limit(limit);
  const results = await query;
  return results.map(mapRowToRecord);
};

export const getVideos = async (
  selectedTags: string[] = [],
  duration: number,
  filter: string[],
  limit: number = 6,
): Promise<{ items: Video[]; total: number }> => {
  return withKnex('yoga', async (knex) => {
    const results = await queryVideos(knex, selectedTags, duration);
    return {
      items: results.slice(0, limit),
      total: results.length,
    };
  });
};

export const getVideo = async (videoId: string): Promise<Video> => {
  return withKnex('yoga', async (knex) => {
    const results = await knex('videos_view').select('*').where({ video_id: videoId });
    return results.length ? mapRowToRecord(results[0]) : null;
  });
};

export const getTags = async (): Promise<Tag[]> => {
  return withKnex('yoga', async (knex) => {
    const results = await knex('tags').select(['name', 'group']).orderBy('name');
    return results.map(({ name, group }) => ({ name, group }));
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
