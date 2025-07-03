import type {ImmutableTree} from './types';

export default function findAll<T, K = T>(
  tree: ImmutableTree<T>,
  key: K,
  cmp: (a: K, b: T) => number,
): Generator<T, undefined, undefined>;
