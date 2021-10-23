import type {ImmutableTree, TreeAction} from './types';

export default function remove<T>(
  tree: ImmutableTree<T> | null,
  value: T,
  cmp: (a: T, b: T) => number,
  notFoundAction: TreeAction<T>,
): ImmutableTree<T> | null;
