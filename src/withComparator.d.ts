import type {ImmutableTree} from './types';
import type {
  InsertConflictHandler,
  InsertNotFoundHandler,
} from './update';

export default function withComparator<T>(
  cmp: (a: T, b: T) => number,
): {
  difference(
    t1: ImmutableTree<T> | null,
    t2: ImmutableTree<T> | null,
  ): ImmutableTree<T> | null,

  find<D = T>(
    tree: ImmutableTree<T> | null,
    value: T,
    defaultValue: D,
  ): T | D,

  findNext<D = T>(
    tree: ImmutableTree<T> | null,
    value: T,
    defaultValue: D,
  ): T | D,

  findPrev<D = T>(
    tree: ImmutableTree<T> | null,
    value: T,
    defaultValue: D,
  ): T | D,

  indexOf(
    tree: ImmutableTree<T> | null,
    value: T,
  ): number,

  insert(
    tree: ImmutableTree<T> | null,
    value: T,
    onConflict?: InsertConflictHandler<T, T>,
  ): ImmutableTree<T>,

  insertIfNotExists(
    tree: ImmutableTree<T> | null,
    value: T,
  ): ImmutableTree<T>,

  insertOrReplaceIfExists(
    tree: ImmutableTree<T> | null,
    value: T,
  ): ImmutableTree<T>,

  insertOrThrowIfExists(
    tree: ImmutableTree<T> | null,
    value: T,
  ): ImmutableTree<T>,

  remove(
    tree: ImmutableTree<T> | null,
    value: T,
  ): ImmutableTree<T> | null,

  removeIfExists(
    tree: ImmutableTree<T> | null,
    value: T,
  ): ImmutableTree<T> | null,

  removeOrThrowIfNotExists(
    tree: ImmutableTree<T> | null,
    value: T,
  ): ImmutableTree<T> | null,

  union(
    t1: ImmutableTree<T> | null,
    t2: ImmutableTree<T> | null,
    onConflict?: (v1: T, v2: T) => T,
  ): ImmutableTree<T> | null,

  update(
    tree: ImmutableTree<T> | null,
    value: T,
    onConflict: InsertConflictHandler<T, T>,
    onNotFound: InsertNotFoundHandler<T, T>,
  ): ImmutableTree<T> | null,
};
