import type {ImmutableTree} from './types';

export type InsertConflictHandler<T> =
  (existingTreeValue: T, value: T) => T;

export function THROW(): never;

export const NOOP:
  <T>(treeValue: T, givenValue: T) => T;

export const REPLACE:
  <T>(treeValue: T, givenValue: T) => T;

export default function insert<T>(
  tree: ImmutableTree<T> | null,
  value: T,
  cmp: (a: T, b: T) => number,
  onConflict: InsertConflictHandler<T>,
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
