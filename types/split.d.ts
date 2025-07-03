import type {ImmutableTree} from './types';

export default function split<T, K = T>(
  tree: ImmutableTree<T>,
  key: K,
  cmp: (a: K, b: T) => number,
): [
  small: ImmutableTree<T>,
  equal: ImmutableTree<T>,
  large: ImmutableTree<T>,
];
