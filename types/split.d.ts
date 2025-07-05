import type {ImmutableTree} from './types';

export type SplitResult<T> = readonly [
  small: ImmutableTree<T>,
  equal: ImmutableTree<T>,
  large: ImmutableTree<T>,
];

export default function split<T, K = T>(
  tree: ImmutableTree<T>,
  key: K,
  cmp: (a: K, b: T, index: number) => number,
): SplitResult<T>;
