export type EmptyImmutableTree = {
  readonly left: EmptyImmutableTree;
  readonly right: EmptyImmutableTree;
  readonly size: 0;
  readonly value: undefined;
};

export type NonEmptyImmutableTree<T> = {
  readonly left: ImmutableTree<T>;
  readonly right: ImmutableTree<T>;
  readonly size: number;
  readonly value: T;
};

export type ImmutableTree<T> =
  | EmptyImmutableTree
  | NonEmptyImmutableTree<T>;

export type MutableTree<T> = {
  left: ImmutableTree<T>;
  right: ImmutableTree<T>;
  size: number;
  value: T;
};
