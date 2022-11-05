import type {ImmutableTree} from './types';

export default function map<T, U>(
  tree: ImmutableTree<T> | null,
  mapper: (value: T) => U,
): ImmutableTree<U> | null;
