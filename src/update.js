// @flow strict

import {balanceLeft, balanceRight} from './balance.js';
import checkOrder from './checkOrder.js';
import empty from './empty.js';
import {
  ValueExistsError,
  ValueNotFoundError,
} from './errors.js';
/*::
import invariant from './invariant.js';
import type {ImmutableTree} from './types.js';

export type InsertConflictHandler<T, K> =
  (existingTreeValue: T, key: K) => T;

export type InsertNotFoundHandler<T, K> =
  (key: K) => T;
*/

export function onConflictThrowError()/*: empty */ {
  // If this is expected, provide your own `onConflict` handler.
  throw new ValueExistsError();
}

export function onConflictKeepTreeValue/*:: <T, K> */(
  treeValue/*: T */,
  givenValue/*: K */,
)/*: T */ {
  return treeValue;
}

export function onConflictUseGivenValue/*:: <T> */(
  treeValue/*: T */,
  givenValue/*: T */,
)/*: T */ {
  return givenValue;
}

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

export default function update/*:: <T, K> */(
  tree/*: ImmutableTree<T> */,
  key/*: K */,
  cmp/*: (key: K, treeValue: T) => number */,
  onConflict/*: InsertConflictHandler<T, K> */,
  onNotFound/*: InsertNotFoundHandler<T, K> */,
)/*: ImmutableTree<T> */ {
  if (tree.size === 0) {
    let valueToInsert;
    try {
      valueToInsert = onNotFound(key);
    } catch (error) {
      if (error === DO_NOTHING_SYMBOL) {
        // This is the only case where `update` can return `empty`.
        return empty;
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
      left: empty,
      right: empty,
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
    const newLeftBranch = update(left, key, cmp, onConflict, onNotFound);
    if (newLeftBranch.size === 0 || newLeftBranch === left) {
      return tree;
    }
    const newTree = {
      left: newLeftBranch,
      right,
      size: newLeftBranch.size + right.size + 1,
      value: tree.value,
    };
    if (newTree.size !== tree.size) {
      balanceLeft(newTree);
    }
    return newTree;
  } else {
    const newRightBranch = update(right, key, cmp, onConflict, onNotFound);
    if (newRightBranch.size === 0 || newRightBranch === right) {
      return tree;
    }
    const newTree = {
      left,
      right: newRightBranch,
      size: left.size + newRightBranch.size + 1,
      value: tree.value,
    };
    if (newTree.size !== tree.size) {
      balanceRight(newTree);
    }
    return newTree;
  }
}
