// @flow strict

import difference from './difference.js';
import find from './find.js';
import findNext from './findNext.js';
import findPrev from './findPrev.js';
import indexOf from './indexOf.js';
import insert, {
  insertIfNotExists,
  insertOrReplaceIfExists,
  insertOrThrowIfExists,
} from './insert.js';
import remove, {
  removeIfExists,
  removeOrThrowIfNotExists,
} from './remove.js';
import union from './union.js';
import update from './update.js';
import validate from './validate.js';
/*::
import type {ImmutableTree} from './types.js';
import type {
  InsertConflictHandler,
  InsertNotFoundHandler,
} from './update.js';
import type {ValidateResult} from './validate.js';
*/

export default function withComparator/*:: <T> */(
  cmp/*: (a: T, b: T) => number */,
)/*: {
  difference(
    t1: ImmutableTree<T>,
    t2: ImmutableTree<T>,
  ): ImmutableTree<T>,

  find<D = T>(
    tree: ImmutableTree<T>,
    value: T,
    defaultValue: D,
  ): T | D,

  findNext<D = T>(
    tree: ImmutableTree<T>,
    value: T,
    defaultValue: D,
  ): T | D,

  findPrev<D = T>(
    tree: ImmutableTree<T>,
    value: T,
    defaultValue: D,
  ): T | D,

  indexOf(
    tree: ImmutableTree<T>,
    value: T,
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

  union(
    t1: ImmutableTree<T>,
    t2: ImmutableTree<T>,
    onConflict?: (v1: T, v2: T) => T,
  ): ImmutableTree<T>,

  update(
    tree: ImmutableTree<T>,
    value: T,
    onConflict: InsertConflictHandler<T, T>,
    onNotFound: InsertNotFoundHandler<T, T>,
  ): ImmutableTree<T>,

  validate(
    tree: ImmutableTree<T>,
  ): ValidateResult<T>,
} */ {
  return {
    difference(t1, t2) {
      return difference(t1, t2, cmp);
    },
    find(tree, value, defaultValue) {
      return find(tree, value, cmp, defaultValue);
    },
    findNext(tree, value, defaultValue) {
      return findNext(tree, value, cmp, defaultValue);
    },
    findPrev(tree, value, defaultValue) {
      return findPrev(tree, value, cmp, defaultValue);
    },
    indexOf(tree, value) {
      return indexOf(tree, value, cmp);
    },
    insert(tree, value, onConflict) {
      return insert(tree, value, cmp, onConflict);
    },
    insertIfNotExists(tree, value) {
      return insertIfNotExists(tree, value, cmp);
    },
    insertOrReplaceIfExists(tree, value) {
      return insertOrReplaceIfExists(tree, value, cmp);
    },
    insertOrThrowIfExists(tree, value) {
      return insertOrThrowIfExists(tree, value, cmp);
    },
    remove(tree, value) {
      return remove(tree, value, cmp);
    },
    removeIfExists(tree, value) {
      return removeIfExists(tree, value, cmp);
    },
    removeOrThrowIfNotExists(tree, value) {
      return removeOrThrowIfNotExists(tree, value, cmp);
    },
    union(tree, value, onConflict) {
      return union(tree, value, cmp, onConflict);
    },
    update(tree, value, onConflict, onNotFound) {
      return update(tree, value, cmp, onConflict, onNotFound);
    },
    validate(tree) {
      return validate(tree, cmp);
    },
  };
}
