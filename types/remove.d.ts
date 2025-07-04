import type {ImmutableTree} from './types';

export default function remove<T, K>(
  tree: ImmutableTree<T>,
  key: K,
  cmp: (key: K, treeValue: T) => number,
): ImmutableTree<T>;

export const removeIfExists: typeof remove;
export const removeOrThrowIfNotExists: typeof remove;
