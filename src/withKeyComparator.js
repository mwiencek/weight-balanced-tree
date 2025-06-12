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

export default function withKeyComparator/*:: <T, K> */(
  cmpKeys/*: (a: K, b: K) => number */,
  getKeyFromValue/*: (value: T) => K */,
)/*: {
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
    value: K,
    onConflict: InsertConflictHandler<T, K>,
    onNotFound: InsertNotFoundHandler<T, K>,
  ): ImmutableTree<T>,

  validate(
    tree: ImmutableTree<T>,
  ): ValidateResult<T>,
} */ {
  function cmp(a/*: T */, b/*: T */) {
    return cmpKeys(getKeyFromValue(a), getKeyFromValue(b));
  }

  function cmpKeyWithValue(key/*: K */, value/*: T */) {
    return cmpKeys(key, getKeyFromValue(value));
  }

  return {
    cmp,
    difference(t1, t2) {
      return difference(t1, t2, cmp);
    },
    find(tree, key, defaultValue) {
      return find(tree, key, cmpKeyWithValue, defaultValue);
    },
    findNext(tree, key, defaultValue) {
      return findNext(tree, key, cmpKeyWithValue, defaultValue);
    },
    findPrev(tree, key, defaultValue) {
      return findPrev(tree, key, cmpKeyWithValue, defaultValue);
    },
    indexOf(tree, key) {
      return indexOf(tree, key, cmpKeyWithValue);
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
    update(tree, key, onConflict, onNotFound) {
      return update(tree, key, cmpKeyWithValue, onConflict, onNotFound);
    },
    validate(tree) {
      return validate(tree, cmp);
    },
  };
}
