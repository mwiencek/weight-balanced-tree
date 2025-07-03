import type {ImmutableTree} from './types';

export default function filter<T>(
  tree: ImmutableTree<T>,
  predicate: (value: T) => boolean,
): ImmutableTree<T>;
