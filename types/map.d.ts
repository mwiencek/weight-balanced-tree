import type {ImmutableTree} from './types';

export default function map<T, U>(
  tree: ImmutableTree<T>,
  mapper: (value: T) => U,
): ImmutableTree<U>;
