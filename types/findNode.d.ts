import type {ImmutableTree} from './types';

export default function findNode<T, K = T>(
  tree: ImmutableTree<T>,
  key: K,
  cmp: (a: K, b: T) => number,
): ImmutableTree<T> | null;
