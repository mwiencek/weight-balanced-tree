import type {ImmutableTree} from './types';

declare class DoNothing {
  // Empty classes are compatible with any type in TypeScript (?).
  private is_typescript_sound: never;
}

export const DO_NOTHING: DoNothing;

export type InsertConflictHandler<T, K> =
  (existingTreeValue: T, key: K) => T;

export type InsertNotFoundHandler<T, K> =
  (key: K) => T | DoNothing;

export function onConflictThrowError(): never;

export const onConflictKeepTreeValue:
  <T, K>(treeValue: T, givenValue: K) => T;

export const onConflictUseGivenValue:
  <T>(treeValue: T, givenValue: T) => T;

export function onNotFoundDoNothing(): DoNothing;

export function onNotFoundThrowError(): never;

export function onNotFoundUseGivenValue<T>(givenValue: T): T;

export default function update<T, K>(
  tree: ImmutableTree<T>,
  key: K,
  cmp: (key: K, treeValue: T) => number,
  onConflict: InsertConflictHandler<T, K>,
  onNotFound: InsertNotFoundHandler<T, K>,
): ImmutableTree<T>;
