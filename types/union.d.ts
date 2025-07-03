import type {ImmutableTree} from './types';

export function onConflictUseSecondValue<T>(v1: T, v2: T): T;

export default function union<T>(
  t1: ImmutableTree<T>,
  t2: ImmutableTree<T>,
  cmp: (a: T, b: T) => number,
  onConflict?: (v1: T, v2: T) => T,
): ImmutableTree<T>;
