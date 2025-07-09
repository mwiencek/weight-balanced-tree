import type {ImmutableTree} from './types';

declare class DoNothing {
  // Empty classes are compatible with any type in TypeScript (?).
  private is_typescript_sound: never;
}

declare class RemoveValue {
  private why_do_i_exist: unknown;
}

export const DO_NOTHING: DoNothing;
export const REMOVE_VALUE: RemoveValue;

export type InsertConflictHandler<T, K> =
  (existingTreeValue: T, key: K) => T | RemoveValue;

export type InsertNotFoundHandler<T, K> =
  (key: K) => T | DoNothing;

export function onConflictThrowError(): never;

export function onConflictKeepTreeValue<T, K>(
  treeValue: T,
  givenValue: K,
): T;

export function onConflictUseGivenValue<T>(
  treeValue: T,
  givenValue: T,
): T;

export function onConflictRemoveValue(): RemoveValue;

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
