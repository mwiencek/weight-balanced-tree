import type {ImmutableTree} from './types';

export default function difference<T>(
  t1: ImmutableTree<T> | null,
  t2: ImmutableTree<T> | null,
  cmp: (a: T, b: T) => number,
): ImmutableTree<T> | null;
