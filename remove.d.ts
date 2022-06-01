import type {ImmutableTree, TreeAction} from './types';

export default function remove<T>(
  tree: ImmutableTree<T> | null,
  value: T,
  cmp: (a: T, b: T) => number,
  notFoundAction: TreeAction<T>,
): ImmutableTree<T> | null;

export function removeIfExists<T>(
  tree: ImmutableTree<T> | null,
  value: T,
  cmp: (a: T, b: T) => number,
): ImmutableTree<T> | null;

export function removeOrThrowIfNotExists<T>(
  tree: ImmutableTree<T> | null,
  value: T,
  cmp: (a: T, b: T) => number,
): ImmutableTree<T> | null;
