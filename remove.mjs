// @flow strict

import {NOOP, THROW} from './actions.mjs';
import {balanceLeft, balanceRight} from './balance.mjs';
import minValue from './minValue.mjs';
/*::
import type {ImmutableTree, MutableTree, TreeAction} from './types.mjs';
*/

export default function remove/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
  value/*: T */,
  cmp/*: (T, T) => number */,
  notFoundAction/*: TreeAction<T> */,
)/*: ImmutableTree<T> | null */ {
  if (tree === null) {
    return null;
  }

  const order = cmp(value, tree.value);
  let newTree/*: MutableTree<T> | null */ = null;

  if (order === 0) {
    if (tree.left === null) {
      return tree.right;
    }
    if (tree.right === null) {
      return tree.left;
    }
    const min = minValue(tree.right);
    newTree = {
      left: tree.left,
      right: remove(tree.right, min, cmp, THROW),
      size: tree.size - 1,
      value: min,
    };
    balanceLeft(newTree);
    return newTree;
  }

  let left = tree.left;
  let right = tree.right;

  if (order < 0) {
    if (left !== null) {
      const newLeft = remove(left, value, cmp, notFoundAction);
      if (newLeft === left) {
        return tree;
      }
      newTree = {
        left: newLeft,
        right,
        size: (newLeft === null ? 0 : newLeft.size) + (right === null ? 0 : right.size) + 1,
        value: tree.value,
      };
      balanceRight(newTree);
    }
  } else if (right !== null) {
    const newRight = remove(right, value, cmp, notFoundAction);
    if (newRight === right) {
      return tree;
    }
    newTree = {
      left,
      right: newRight,
      size: (left === null ? 0 : left.size) + (newRight === null ? 0 : newRight.size) + 1,
      value: tree.value,
    };
    balanceLeft(newTree);
  }

  if (newTree === null) {
    return notFoundAction(tree, value);
  }

  return newTree;
}

export function removeIfExists/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
  value/*: T */,
  cmp/*: (T, T) => number */,
)/*: ImmutableTree<T> | null */ {
  return remove(tree, value, cmp, NOOP);
}

export function removeOrThrowIfNotExists/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
  value/*: T */,
  cmp/*: (T, T) => number */,
)/*: ImmutableTree<T> | null */ {
  return remove(tree, value, cmp, THROW);
}
