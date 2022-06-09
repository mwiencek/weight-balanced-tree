import type {ImmutableTree} from './types';

export default function zip<T, U>(
  t1: ImmutableTree<T> | null,
  t2: ImmutableTree<U> | null,
): Generator<[T | undefined, U | undefined], undefined, undefined>;
