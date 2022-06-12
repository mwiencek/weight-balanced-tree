import type {ImmutableTree} from './types';

export type InsertConflictHandler<T, K> =
  (existingTreeValue: T, key: K) => T;

export type InsertNotFoundHandler<T, K> =
  (key: K) => T;

export function onConflictThrowError(): never;

export const onConflictKeepTreeValue:
  <T, K>(treeValue: T, givenValue: K) => T;

export const onConflictUseGivenValue:
  <T>(treeValue: T, givenValue: T) => T;

export function onNotFoundUseGivenValue<T>(givenValue: T): T;

// Aliases for backwards compatibility.
export const NOOP: typeof onConflictKeepTreeValue;
export const REPLACE: typeof onConflictUseGivenValue;
export const THROW: typeof onConflictThrowError;

export function insertByKey<T, K>(
  tree: ImmutableTree<T> | null,
  key: K,
  cmp: (key: K, treeValue: T) => number,
  onConflict: InsertConflictHandler<T, K>,
  onNotFound: InsertNotFoundHandler<T, K>,
): ImmutableTree<T>;

export default function insert<T>(
  tree: ImmutableTree<T> | null,
  value: T,
  cmp: (a: T, b: T) => number,
  onConflict?: InsertConflictHandler<T, T>,
): ImmutableTree<T>;

type InsertHelper = <T>(
  tree: ImmutableTree<T> | null,
  value: T,
  cmp: (a: T, b: T) => number,
) => ImmutableTree<T>;

export const insertIfNotExists: InsertHelper;
export const insertOrReplaceIfExists: InsertHelper;
export const insertOrThrowIfExists: InsertHelper;
