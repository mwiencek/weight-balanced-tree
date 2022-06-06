import type {ImmutableTree} from './types';

export type InsertConflictHandler<T> =
  (existingTreeValue: T, value: T) => T;

export function onConflictThrowError(): never;

export const onConflictKeepTreeValue:
  <T>(treeValue: T, givenValue: T) => T;

export const onConflictUseGivenValue:
  <T>(treeValue: T, givenValue: T) => T;

// Aliases for backwards compatibility.
export const NOOP: typeof onConflictKeepTreeValue;
export const REPLACE: typeof onConflictUseGivenValue;
export const THROW: typeof onConflictThrowError;

export default function insert<T>(
  tree: ImmutableTree<T> | null,
  value: T,
  cmp: (a: T, b: T) => number,
  onConflict?: InsertConflictHandler<T>,
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
