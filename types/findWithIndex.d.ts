import type {ImmutableTree} from './types';

export default function findWithIndex<T, K = T, D = T>(
  tree: ImmutableTree<T>,
  key: K,
  cmp: (a: K, b: T) => number,
  defaultValue: D,
): [value: T | D, index: number];
