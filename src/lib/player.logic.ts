import { Video } from '../../types';
import { COMPLETE_PERC } from './constants';
import localStore from './localStore';
import { getPlayedStorageKey, sendEvent } from './utils';

export interface State {
  player?: any;
  playerState: number;
  currentVideo: Video;
  hitWatchThreshold: boolean;
}

type Action =
  | { type: 'SKIP' }
  | { type: 'PLAY_PAUSE'; payload: number }
  | { type: 'VIDEO_TICK' }
  | { type: 'SEEK'; payload: number }
  | { type: 'FINISH_VIDEO'; payload: { rate: number; videoId: string } }
  | { type: 'SET_PLAYER_STATE'; payload: number }
  | { type: 'SET_PLAYER'; payload: any };

const hasVideoHitCompletedPercentage = (player) => {
  const watchedPercentage = !player ? 0 : player.getCurrentTime() / player.getDuration();
  return watchedPercentage > COMPLETE_PERC;
};

const markVideoAsWatched = (videoId: string): void => {
  const key = getPlayedStorageKey();
  const currentCompleted = localStore.getJson(key);
  const completed = Array.from(new Set([...currentCompleted, videoId]));
  localStore.setJson(key, completed);
};

const handlers: { [key in Action['type']]: (state: State, payload: any) => State } = {
  SET_PLAYER: (state, payload) => ({ ...state, player: payload }),
  SET_PLAYER_STATE: (state, playerState): State => {
    return { ...state, playerState };
  },
  SKIP: (state): State => {
    const { player } = state;
    player.pauseVideo();
    return { ...state };
  },
  PLAY_PAUSE: (state, position): State => {
    const { player } = state;
    const s = player.getPlayerState();
    if (typeof position !== 'undefined') player.seekTo(position);
    if (s === 1) player.pauseVideo();
    else player.playVideo();
    return { ...state };
  },
  SEEK: (state, payload): State => {
    const { player } = state;
    player.seekTo(player.getCurrentTime() + payload);
    return state;
  },
  VIDEO_TICK: (state): State => {
    const { player, currentVideo } = state;
    const hasWatchedVideo = hasVideoHitCompletedPercentage(player);
    if (!hasWatchedVideo || !player || player.getPlayerState() !== 1) return state;
    markVideoAsWatched(currentVideo.videoId);
    return { ...state, hitWatchThreshold: hasWatchedVideo };
  },
  FINISH_VIDEO: (state, { rate, videoId }): State => {
    const { currentVideo } = state;
    markVideoAsWatched(currentVideo.videoId);
    // TODO: shouldnt be doing this inside a reducer function, but as we dont care about the response
    // its probably ok for now
    const position = state.player ? Math.floor(state.player.getCurrentTime()) : -1;
    sendEvent(videoId, { rate, position, key: '-' });

    return { ...state, playerState: undefined };
  },
};

export default (state: State, action: Action): State =>
  action.type in handlers ? handlers[action.type](state, 'payload' in action ? action.payload : null) : state;
