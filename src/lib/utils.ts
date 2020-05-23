import { TimeRange } from '../../types';
import { OFFSET } from './constants';

export const flatten = <T>(aOfas: T[][]): T[] => aOfas.reduce((m, v) => m.concat(v), []);

export const shuffle = <T>(arr: T[]): T[] =>
  arr
    .map((a: T) => [Math.random(), a])
    .sort(([a]: [number], [b]: [number]) => a - b)
    .map(([, v]: [number, T]) => v);

export const splitShuffle = (arr: any[], parts: number = 1) => {
  const split = Math.floor(arr.length / parts);
  const next = [];
  let count = 0;
  while (count < parts) {
    const end = count + 1 === parts ? arr.length : (count + 1) * split;
    next.push(...shuffle(arr.slice(count * split, end)));
    count += 1;
  }
  return next;
};

export const buildUrl = (duration: number, tag?: string) => `/${duration}-minute${tag ? `-${tag}` : ''}-yoga`;

export const durationToTimeRange = (duration: number): TimeRange => ({
  min: duration - OFFSET,
  max: duration + OFFSET,
});

export const getItemStorageKey = (id, suffix?: string) => `p-${id}${suffix ? '-' + suffix : ''}`;

export const snooze = async (timeout: number) => new Promise((r) => setTimeout(r, timeout));

export const uniq = <T>(as: T[]) => Array.from(new Set(as));

export const intersection = <T>(xs: T[], ys: T[]) => {
  const zs = new Set(ys);
  return uniq(xs).filter((x) => zs.has(x));
};
