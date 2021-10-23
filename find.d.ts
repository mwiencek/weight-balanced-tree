import type {ImmutableTree} from './types';

export default function find<T, V = T>(
  tree: ImmutableTree<T> | null,
  value: V,
  cmp: (a: V, b: T) => number,
): ImmutableTree<T> | null;
