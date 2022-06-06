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
