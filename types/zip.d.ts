import type {ImmutableTree} from './types';

export default function zip<T, U>(
  t1: ImmutableTree<T>,
  t2: ImmutableTree<U>,
): Generator<[T | undefined, U | undefined], undefined, undefined>;
