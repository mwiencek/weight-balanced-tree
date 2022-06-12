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

export const onNotFoundDoNothing:
  (givenValue: unknown) => never;

export function onNotFoundThrowError(): never;

export function onNotFoundUseGivenValue<T>(givenValue: T): T;

export default function update<T, K>(
  tree: ImmutableTree<T> | null,
  key: K,
  cmp: (key: K, treeValue: T) => number,
  onConflict: InsertConflictHandler<T, K>,
  onNotFound: InsertNotFoundHandler<T, K>,
): ImmutableTree<T> | null;
