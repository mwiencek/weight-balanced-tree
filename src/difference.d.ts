import type {ImmutableTree} from './types';

export default function difference<T>(
  t1: ImmutableTree<T>,
  t2: ImmutableTree<T>,
  cmp: (a: T, b: T) => number,
): ImmutableTree<T>;
