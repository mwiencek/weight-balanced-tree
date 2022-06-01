// @flow strict

import {NOOP, REPLACE, THROW} from './actions.mjs';
import {balanceLeft, balanceRight} from './balance.mjs';
/*::
import type {ImmutableTree, TreeAction} from './types.mjs';
*/

export default function insert/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
  value/*: T */,
  cmp/*: (T, T) => number */,
  duplicateAction/*: TreeAction<T> */,
)/*: ImmutableTree<T> */ {
  if (tree === null) {
    return {
      value,
      size: 1,
      left: null,
      right: null,
    };
  }

  const order = cmp(value, tree.value);

  if (order === 0) {
    return duplicateAction(tree, value);
  }

  const left = tree.left;
  const right = tree.right;

  if (order < 0) {
    const newLeftBranch = insert(left, value, cmp, duplicateAction);
    if (newLeftBranch === left) {
      return tree;
    }
    const newTree = {
      value: tree.value,
      size: newLeftBranch.size + (right === null ? 0 : right.size) + 1,
      left: newLeftBranch,
      right,
    };
    balanceLeft(newTree);
    return newTree;
  } else {
    const newRightBranch = insert(right, value, cmp, duplicateAction);
    if (newRightBranch === right) {
      return tree;
    }
    const newTree = {
      value: tree.value,
      size: (left === null ? 0 : left.size) + newRightBranch.size + 1,
      left,
      right: newRightBranch,
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
