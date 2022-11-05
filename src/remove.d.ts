import type {ImmutableTree} from './types';

export default function remove<T>(
  tree: ImmutableTree<T> | null,
  value: T,
  cmp: (a: T, b: T) => number,
): ImmutableTree<T> | null;

export const removeIfExists: typeof remove;
export const removeOrThrowIfNotExists: typeof remove;
