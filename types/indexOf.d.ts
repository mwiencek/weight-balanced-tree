import type {ImmutableTree} from './types';

export default function indexOf<T, K = T>(
  tree: ImmutableTree<T>,
  key: K,
  cmp: (a: K, b: T) => number,
): number;
