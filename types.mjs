// @flow strict

export type ImmutableTree<+T> = {
  +value: T,
  +size: number,
  +left: ImmutableTree<T> | null,
  +right: ImmutableTree<T> | null,
};

export type MutableTree<T> = {
  value: T,
  size: number,
  left: ImmutableTree<T> | null,
  right: ImmutableTree<T> | null,
};

export type TreeAction<T> =
  (tree: ImmutableTree<T>, value: T) => ImmutableTree<T>;

export type SomeTreeAction =
  <T>(tree: ImmutableTree<T>, value: T) => ImmutableTree<T>;
