// @flow strict

import {balanceLeft, balanceRight} from './balance.mjs';
/*::
import type {ImmutableTree, TreeAction} from './types.mjs';
*/

export function THROW()/*: empty */ {
  throw new Error('');
}

export const NOOP =
  /*:: <T> */(treeValue/*: T */, givenValue/*: T */)/*: T */ => treeValue;

export const REPLACE =
  /*:: <T> */(treeValue/*: T */, givenValue/*: T */)/*: T */ => givenValue;

export default function insert/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
  value/*: T */,
  cmp/*: (T, T) => number */,
  onConflict/*: TreeAction<T> */,
)/*: ImmutableTree<T> */ {
  if (tree === null) {
    return {
      left: null,
      right: null,
      size: 1,
      value,
    };
  }

  const order = cmp(value, tree.value);

  if (order === 0) {
    const valueToInsert = onConflict(tree.value, value);
    if (Object.is(valueToInsert, tree.value)) {
      return tree;
    }
    return {
      left: tree.left,
      right: tree.right,
      size: 1,
      value: valueToInsert,
    };
  }

  const left = tree.left;
  const right = tree.right;

  if (order < 0) {
    const newLeftBranch = insert(left, value, cmp, onConflict);
    if (newLeftBranch === left) {
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
    const newRightBranch = insert(right, value, cmp, onConflict);
    if (newRightBranch === right) {
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

export function insertIfNotExists/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
  value/*: T */,
  cmp/*: (T, T) => number */,
)/*: ImmutableTree<T> */ {
  return insert(tree, value, cmp, NOOP);
}

export function insertOrReplaceIfExists/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
  value/*: T */,
  cmp/*: (T, T) => number */,
)/*: ImmutableTree<T> */ {
  return insert(tree, value, cmp, REPLACE);
}

export function insertOrThrowIfExists/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
  value/*: T */,
  cmp/*: (T, T) => number */,
)/*: ImmutableTree<T> */ {
  return insert(tree, value, cmp, THROW);
}
