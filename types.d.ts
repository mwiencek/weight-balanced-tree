export interface ImmutableTree<T> {
  readonly left: ImmutableTree<T> | null;
  readonly right: ImmutableTree<T> | null;
  readonly size: number;
  readonly value: T;
}

export interface MutableTree<T> {
  left: ImmutableTree<T> | null;
  right: ImmutableTree<T> | null;
  size: number;
  value: T;
}

export type TreeAction<T> =
  (tree: ImmutableTree<T>, value: T) => ImmutableTree<T>;

export type SomeTreeAction =
  <T>(tree: ImmutableTree<T>, value: T) => ImmutableTree<T>;
