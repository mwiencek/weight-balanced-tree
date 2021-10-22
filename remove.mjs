// @flow strict

import {THROW} from './actions.mjs';
import {balanceLeft, balanceRight} from "./balance.mjs";
import minValue from './minValue.mjs';
import type {ImmutableTreeT, MutableTreeT, TreeActionT} from './types';

export default function remove<T>(
  tree: ImmutableTreeT<T> | null,
  value: T,
  cmp: (T, T) => number,
  notFoundAction: TreeActionT<T>,
): ImmutableTreeT<T> | null {
  if (tree === null) {
    return null;
  }

  const order = cmp(value, tree.value);
  let newTree: MutableTreeT<T> | null = null;

  if (order === 0) {
    if (tree.left === null) {
      return tree.right;
    }
    if (tree.right === null) {
      return tree.left;
    }
    const min = minValue(tree.right);
    newTree = {
      value: min,
      size: tree.size - 1,
      left: tree.left,
      right: remove(tree.right, min, cmp, THROW),
    };
    balanceLeft(newTree);
    return newTree;
  }

  let left = tree.left;
  let right = tree.right;

  if (order < 0) {
    if (left !== null) {
      left = remove(left, value, cmp, notFoundAction);
      newTree = {
        value: tree.value,
        size: (left === null ? 0 : left.size) + (right === null ? 0 : right.size) + 1,
        left,
        right,
      };
      balanceRight(newTree);
    }
  } else if (right !== null) {
    right = remove(right, value, cmp, notFoundAction);
    newTree = {
      value: tree.value,
      size: (left === null ? 0 : left.size) + (right === null ? 0 : right.size) + 1,
      left,
      right,
    };
    balanceLeft(newTree);
  }

  if (newTree === null) {
    return notFoundAction(tree, value);
  }

  return newTree;
}
