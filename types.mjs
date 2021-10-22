// @flow strict

export type ImmutableTreeT<+T> = {
  +value: T,
  +size: number,
  +left: ImmutableTreeT<T> | null,
  +right: ImmutableTreeT<T> | null,
};

export type MutableTreeT<T> = {
  value: T,
  size: number,
  left: ImmutableTreeT<T> | null,
  right: ImmutableTreeT<T> | null,
};

export type TreeActionT<T> =
  (tree: ImmutableTreeT<T>, value: T) => ImmutableTreeT<T>;

export type SomeTreeActionT =
  <T>(tree: ImmutableTreeT<T>, value: T) => ImmutableTreeT<T>;
