import { TimeRange } from '../../types';
import { OFFSET } from './constants';

export const flatten = <T>(aOfas: T[][]): T[] => aOfas.reduce((m, v) => m.concat(v), []);

export const shuffle = <T>(arr: T[]): T[] =>
  arr
    .map((a: T) => [Math.random(), a])
    .sort(([a]: [number], [b]: [number]) => a - b)
    .map(([, v]: [number, T]) => v);

export const buildUrl = (duration: number, tag?: string) => `/${duration}-minute${tag ? `-${tag}` : ''}-yoga`;

export const durationToTimeRange = (duration: number): TimeRange => ({
  min: duration - OFFSET,
  max: duration + OFFSET,
});

export const getPlayedStorageKey = () => `played`;

export const snooze = async (timeout: number) => new Promise((r) => setTimeout(r, timeout));

export const uniq = <T>(as: T[]) => Array.from(new Set(as));

export const intersection = <T>(xs: T[], ys: T[]) => {
  const zs = new Set(ys);
  return uniq(xs).filter((x) => zs.has(x));
};

export const sendEvent = (videoId, body: { rate: number; position: number; key: string }) => {
  if (!navigator.sendBeacon) return;
  const headers = { type: 'application/json' };
  const blob = new Blob([JSON.stringify(body)], headers);
  navigator.sendBeacon(`/api/videos/${videoId}/feedback`, blob);
};
