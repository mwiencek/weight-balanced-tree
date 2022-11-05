import type {ImmutableTree} from './types';

export default function findNext<T, K = T, D = T>(
  tree: ImmutableTree<T> | null,
  key: K,
  cmp: (a: K, b: T) => number,
  defaultValue: D,
): T | D;
