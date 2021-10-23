export interface ImmutableTree<T> {
  readonly value: T;
  readonly size: number;
  readonly left: ImmutableTree<T> | null;
  readonly right: ImmutableTree<T> | null;
}

export interface MutableTree<T> {
  value: T;
  size: number;
  left: ImmutableTree<T> | null;
  right: ImmutableTree<T> | null;
}

export type TreeAction<T> =
  (tree: ImmutableTree<T>, value: T) => ImmutableTree<T>;

export type SomeTreeAction =
  <T>(tree: ImmutableTree<T>, value: T) => ImmutableTree<T>;
