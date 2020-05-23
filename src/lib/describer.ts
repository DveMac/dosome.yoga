import { TAG_GROUPS } from './constants';
import { intersection } from './utils';

const joinWith = (iter: (a: string, idx: number, len: number) => string) => (arr: string[]): string => {
  return arr.slice(1).reduce((m, x, idx) => {
    return `${m}${iter(x, idx, arr.length - 1)}${x}`;
  }, arr[0]);
};

export const generatePracticeDescription = (tags: string[], duration: number) => {
  const joiner = joinWith((v, idx, len) => (idx < len - 1 ? ', ' : ' and '));
  const difficultyTags = intersection(TAG_GROUPS.difficulty, tags);
  const styleTags = intersection(TAG_GROUPS.style, tags);
  return ['My', joiner(difficultyTags), duration, 'minute', joiner(styleTags), 'practice'].filter(Boolean).join(' ');
};
