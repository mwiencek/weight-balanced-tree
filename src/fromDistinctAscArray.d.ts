import type {ImmutableTree} from './types';

export default function fromDistinctAscArray<T>(
  array: ReadonlyArray<T>,
): ImmutableTree<T>;
