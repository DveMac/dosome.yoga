import { Video } from '../../types';
import { COMPLETE_PERC } from './constants';
import localStore from './localStore';
import { getItemStorageKey, shuffle } from './utils';

export type Card = 'picker' | 'review' | 'complete2' | 'skipped' | 'video';

export interface State {
  id?: string;
  player?: any;
  playerState: number;
  visibleCard: Card;
  isLastVideo: boolean;
  completed: string[];
  currentVideo?: Video;
  videos: Video[];
  choices: Video[];
}

type Action =
  | { type: 'SKIP' }
  | { type: 'PLAY_PAUSE'; payload: number }
  | { type: 'SELECT_VIDEO'; payload: string }
  | { type: 'VIDEO_TICK' }
  | { type: 'SEEK'; payload: number }
  | { type: 'FINISH_SESSION'; payload: { rate: number; videoId: string; nextCard: Card } }
  | { type: 'SET_PLAYER_STATE'; payload: number }
  | { type: 'SET_PLAYER'; payload: any };

const videoHasHitWatchedPercentage = (player) => {
  const watchedPercentage = !player ? 0 : player.getCurrentTime() / player.getDuration();
  return watchedPercentage > COMPLETE_PERC;
};

const getVisibleCardFromWatchedPercentage = (player) => (videoHasHitWatchedPercentage(player) ? 'review' : 'skipped');

const pickChoices = (videos: Video[], completed: string[]) =>
  shuffle(videos.filter((v) => completed.indexOf(v.videoId) < 0).slice(0, 10)).slice(0, 3);

const markVideoAsWatched = (playlistKey: string, videoId: string) => {
  const key = getItemStorageKey(playlistKey);
  const currentCompleted = localStore.getJson(key);
  const completed = Array.from(new Set([...currentCompleted, videoId]));
  localStore.setJson(key, completed);
  return completed;
};

const handlers: { [key in Action['type']]: (state: State, payload: any) => State } = {
  SET_PLAYER: (state, payload) => ({ ...state, player: payload }),
  SET_PLAYER_STATE: (state, playerState) => {
    const { player } = state;
    const visibleCard = playerState === 0 ? getVisibleCardFromWatchedPercentage(player) : state.visibleCard;
    return { ...state, playerState, visibleCard };
  },
  SKIP: (state) => {
    const { player } = state;
    const visibleCard = getVisibleCardFromWatchedPercentage(player);
    player.pauseVideo();
    return { ...state, visibleCard };
  },
  PLAY_PAUSE: (state, position) => {
    const { player } = state;
    const s = player.getPlayerState();
    if (typeof position !== 'undefined') player.seekTo(position);
    if (s === 1) player.pauseVideo();
    else player.playVideo();
    return { ...state, visibleCard: 'video' };
  },
  SEEK: (state, payload) => {
    const { player } = state;
    player.seekTo(player.getCurrentTime() + payload);
    return state;
  },
  VIDEO_TICK: (state) => {
    const { player, currentVideo, completed: currentCompleted } = state;
    const hasWatchedVideo = videoHasHitWatchedPercentage(player);
    if (!hasWatchedVideo || !player || player.getPlayerState() !== 1) return state;
    if (currentCompleted.indexOf(currentVideo.videoId) >= 0) return state;
    const completed = markVideoAsWatched(state.id, currentVideo.videoId);
    return { ...state, completed };
  },
  FINISH_SESSION: (state, { rate, videoId, nextCard }) => {
    const { id, currentVideo } = state;
    const completed = markVideoAsWatched(id, currentVideo.videoId);
    const choices = pickChoices(state.videos, completed);
    // TODO: shouldnt be doing this inside a reducer function, but as we dont care about the response
    // its probably ok for now
    if (navigator.sendBeacon) {
      const position = state.player ? Math.floor(state.player.getCurrentTime()) : -1;
      const headers = { type: 'application/json' };
      const blob = new Blob([JSON.stringify({ rate, position, key: state.id })], headers);
      navigator.sendBeacon(`/api/videos/${videoId}/feedback`, blob);
    }
    // ---
    return { ...state, playerState: undefined, choices, completed, visibleCard: nextCard || 'picker' };
  },
  SELECT_VIDEO: (state, videoId) => {
    const currentVideo = state.videos.find((v) => v.videoId === videoId);
    return { ...state, currentVideo, visibleCard: currentVideo ? 'video' : 'picker' };
  },
};

export const initState = (state: State): State => {
  let completed = [];
  if (state.id) {
    const key = getItemStorageKey(state.id);
    completed = state.id ? localStore.getJson(key) || [] : [];
    localStore.setJson(key, completed);
  }
  const isLastVideo = completed.length - 1 === state.videos.length;
  const choices = pickChoices(state.videos, completed);
  return { ...state, completed, isLastVideo, choices };
};

export default (state: State, action: Action): State =>
  action.type in handlers ? handlers[action.type](state, 'payload' in action ? action.payload : null) : state;
