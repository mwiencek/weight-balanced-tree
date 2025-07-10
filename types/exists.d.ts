import type {ImmutableTree} from './types';

export default function exists<T, K = T>(
  tree: ImmutableTree<T>,
  key: K,
  cmp: (a: K, b: T) => number,
): boolean;
