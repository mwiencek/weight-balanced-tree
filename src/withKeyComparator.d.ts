import type {ImmutableTree} from './types';
import type {
  InsertConflictHandler,
  InsertNotFoundHandler,
} from './update';
import type {ValidateResult} from './validate';

export default function withKeyComparator<T, K>(
  cmpKeys: (a: K, b: K) => number,
  getKeyFromValue: (value: T) => K,
): {
  cmp(a: T, b: T): number,

  difference(
    t1: ImmutableTree<T>,
    t2: ImmutableTree<T>,
  ): ImmutableTree<T>,

  find<D = T>(
    tree: ImmutableTree<T>,
    key: K,
    defaultValue: D,
  ): T | D,

  findNext<D = T>(
    tree: ImmutableTree<T>,
    key: K,
    defaultValue: D,
  ): T | D,

  findPrev<D = T>(
    tree: ImmutableTree<T>,
    key: K,
    defaultValue: D,
  ): T | D,

  indexOf(
    tree: ImmutableTree<T>,
    key: K,
  ): number,

  insert(
    tree: ImmutableTree<T>,
    value: T,
    onConflict?: InsertConflictHandler<T, T>,
  ): ImmutableTree<T>,

  insertIfNotExists(
    tree: ImmutableTree<T>,
    value: T,
  ): ImmutableTree<T>,

  insertOrReplaceIfExists(
    tree: ImmutableTree<T>,
    value: T,
  ): ImmutableTree<T>,

  insertOrThrowIfExists(
    tree: ImmutableTree<T>,
    value: T,
  ): ImmutableTree<T>,

  intersection(
    t1: ImmutableTree<T>,
    t2: ImmutableTree<T>,
    combiner?: (v1: T, v2: T) => T,
  ): ImmutableTree<T>,

  remove(
    tree: ImmutableTree<T>,
    value: T,
  ): ImmutableTree<T>,

  removeIfExists(
    tree: ImmutableTree<T>,
    value: T,
  ): ImmutableTree<T>,

  removeOrThrowIfNotExists(
    tree: ImmutableTree<T>,
    value: T,
  ): ImmutableTree<T>,

  split(
    tree: ImmutableTree<T>,
    key: K,
  ): [
    small: ImmutableTree<T>,
    equal: ImmutableTree<T>,
    large: ImmutableTree<T>,
  ],

  union(
    t1: ImmutableTree<T>,
    t2: ImmutableTree<T>,
    onConflict?: (v1: T, v2: T) => T,
  ): ImmutableTree<T>,

  update(
    tree: ImmutableTree<T>,
    key: K,
    onConflict: InsertConflictHandler<T, T>,
    onNotFound: InsertNotFoundHandler<T, T>,
  ): ImmutableTree<T>,

  validate(
    tree: ImmutableTree<T>,
  ): ValidateResult<T>,
};
