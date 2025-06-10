import type {ImmutableTree} from './types';

export default function remove<T>(
  tree: ImmutableTree<T>,
  value: T,
  cmp: (a: T, b: T) => number,
): ImmutableTree<T>;

export const removeIfExists: typeof remove;
export const removeOrThrowIfNotExists: typeof remove;
