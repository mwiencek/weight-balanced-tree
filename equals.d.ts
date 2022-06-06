import type {ImmutableTree} from './types';

export default function equals<T>(
  a: ImmutableTree<T> | null,
  b: ImmutableTree<T> | null,
  cmp: (a: T, b: T) => number,
): boolean;
