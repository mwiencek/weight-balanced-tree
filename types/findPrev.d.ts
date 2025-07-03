import type {ImmutableTree} from './types';

export default function findPrev<T, K = T, D = T>(
  tree: ImmutableTree<T>,
  key: K,
  cmp: (a: K, b: T) => number,
  defaultValue: D,
): T | D;
