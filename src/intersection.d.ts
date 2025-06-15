import type {ImmutableTree} from './types';

export function useSecondValue<T>(v1: T, v2: T): T;

export default function intersection<T>(
  t1: ImmutableTree<T>,
  t2: ImmutableTree<T>,
  cmp: (a: T, b: T) => number,
  combiner?: (v1: T, v2: T) => T,
): ImmutableTree<T>;
