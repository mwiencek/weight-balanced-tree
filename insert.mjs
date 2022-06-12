// @flow strict

import {balanceLeft, balanceRight} from './balance.mjs';
import checkOrder from './checkOrder.mjs';
import {
  ValueExistsError,
  ValueNotFoundError,
} from './errors.mjs';
/*::
import invariant from './invariant.mjs';
import type {ImmutableTree} from './types.mjs';

export type InsertConflictHandler<T, K> =
  (existingTreeValue: T, key: K) => T;

export type InsertNotFoundHandler<T, K> =
  (key: K) => T;
*/

export function onConflictThrowError()/*: empty */ {
  // If this is expected, provide your own `onConflict` handler.
  throw new ValueExistsError();
}

export const onConflictKeepTreeValue =
  /*:: <T, K> */(treeValue/*: T */, givenValue/*: K */)/*: T */ => treeValue;

export const onConflictUseGivenValue =
  /*:: <T> */(treeValue/*: T */, givenValue/*: T */)/*: T */ => givenValue;

const DO_NOTHING_SYMBOL = Symbol('DO_NOTHING');

export function onNotFoundDoNothing(
  givenValue/*: mixed */,
)/*: empty */ {
  throw DO_NOTHING_SYMBOL;
}

export function onNotFoundThrowError()/*: empty */ {
  throw new ValueNotFoundError();
}

export function onNotFoundUseGivenValue/*:: <T> */(
  givenValue/*: T */,
)/*: T */ {
  return givenValue;
}

// Aliases for backwards compatibility.
export const NOOP = onConflictKeepTreeValue;
export const THROW = onConflictThrowError;
export const REPLACE = onConflictUseGivenValue;

export function insertByKey/*:: <T, K> */(
  tree/*: ImmutableTree<T> | null */,
  key/*: K */,
  cmp/*: (key: K, treeValue: T) => number */,
  onConflict/*: InsertConflictHandler<T, K> */,
  onNotFound/*: InsertNotFoundHandler<T, K> */,
)/*: ImmutableTree<T> | null */ {
  if (tree === null) {
    let valueToInsert;
    try {
      valueToInsert = onNotFound(key);
    } catch (error) {
      if (error === DO_NOTHING_SYMBOL) {
        // This is the only case where `insertByKey` can return null.
        return null;
      }
      throw error;
    }
    if (!Object.is(valueToInsert, key)) {
      checkOrder(
        /* expected = */ key,
        /* got = */ valueToInsert,
        cmp,
      );
    }
    return {
      left: null,
      right: null,
      size: 1,
      value: valueToInsert,
    };
  }

  const order = cmp(key, tree.value);

  if (order === 0) {
    const valueToInsert = onConflict(tree.value, key);
    if (Object.is(valueToInsert, tree.value)) {
      return tree;
    } else {
      checkOrder(
        /* expected = */ key,
        /* got = */ valueToInsert,
        cmp,
      );
    }
    return {
      left: tree.left,
      right: tree.right,
      size: tree.size,
      value: valueToInsert,
    };
  }

  const left = tree.left;
  const right = tree.right;

  if (order < 0) {
    const newLeftBranch = insertByKey(left, key, cmp, onConflict, onNotFound);
    if (newLeftBranch === null || newLeftBranch === left) {
      return tree;
    }
    const newTree = {
      left: newLeftBranch,
      right,
      size: newLeftBranch.size + (right === null ? 0 : right.size) + 1,
      value: tree.value,
    };
    balanceLeft(newTree);
    return newTree;
  } else {
    const newRightBranch = insertByKey(right, key, cmp, onConflict, onNotFound);
    if (newRightBranch === null || newRightBranch === right) {
      return tree;
    }
    const newTree = {
      left,
      right: newRightBranch,
      size: (left === null ? 0 : left.size) + newRightBranch.size + 1,
      value: tree.value,
    };
    balanceRight(newTree);
    return newTree;
  }
}

export default function insert/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
  onConflict/*:: ?: InsertConflictHandler<T, T> */ = onConflictThrowError,
)/*: ImmutableTree<T> */ {
  const result = insertByKey/*:: <T, T> */(
    tree,
    value,
    cmp,
    onConflict,
    onNotFoundUseGivenValue,
  );
  /*:: invariant(result); */
  return result;
}

export function insertIfNotExists/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
)/*: ImmutableTree<T> */ {
  const result = insertByKey/*:: <T, T> */(
    tree,
    value,
    cmp,
    onConflictKeepTreeValue,
    onNotFoundUseGivenValue,
  );
  /*:: invariant(result); */
  return result;
}

export function insertOrReplaceIfExists/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
)/*: ImmutableTree<T> */ {
  const result = insertByKey/*:: <T, T> */(
    tree,
    value,
    cmp,
    onConflictUseGivenValue,
    onNotFoundUseGivenValue,
  );
  /*:: invariant(result); */
  return result;
}

export function insertOrThrowIfExists/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
)/*: ImmutableTree<T> */ {
  const result = insertByKey/*:: <T, T> */(
    tree,
    value,
    cmp,
    onConflictThrowError,
    onNotFoundUseGivenValue,
  );
  /*:: invariant(result); */
  return result;
}
