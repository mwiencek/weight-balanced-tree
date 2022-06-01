import type {ImmutableTree, TreeAction} from './types';

export default function insert<T>(
  tree: ImmutableTree<T> | null,
  value: T,
  cmp: (a: T, b: T) => number,
  duplicateAction: TreeAction<T>,
): ImmutableTree<T>;

export function insertIfNotExists<T>(
  tree: ImmutableTree<T> | null,
  value: T,
  cmp: (a: T, b: T) => number,
): ImmutableTree<T>;

export function insertOrReplaceIfExists<T>(
  tree: ImmutableTree<T> | null,
  value: T,
  cmp: (a: T, b: T) => number,
): ImmutableTree<T>;

export function insertOrThrowIfExists<T>(
  tree: ImmutableTree<T> | null,
  value: T,
  cmp: (a: T, b: T) => number,
): ImmutableTree<T>;
