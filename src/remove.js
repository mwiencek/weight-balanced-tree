// @flow strict

import {balanceLeft, balanceRight} from './balance.js';
import empty from './empty.js';
import {ValueNotFoundError} from './errors.js';
import minValue from './minValue.js';
/*::
import type {ImmutableTree, MutableTree} from './types.js';
*/

export default function remove/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
)/*: ImmutableTree<T> */ {
  if (tree.size === 0) {
    return tree;
  }

  const order = cmp(value, tree.value);
  let newTree/*: MutableTree<T> | null */ = null;

  if (order === 0) {
    if (tree.left.size === 0) {
      return tree.right;
    }
    if (tree.right.size === 0) {
      return tree.left;
    }
    const min = minValue(tree.right);
    newTree = {
      left: tree.left,
      right: remove(tree.right, min, cmp),
      size: tree.size - 1,
      value: min,
    };
    balanceLeft(newTree);
    return newTree;
  }

  let left = tree.left;
  let right = tree.right;

  if (order < 0) {
    if (left.size !== 0) {
      const newLeft = remove(left, value, cmp);
      if (newLeft === left) {
        return tree;
      }
      newTree = {
        left: newLeft,
        right,
        size: newLeft.size + right.size + 1,
        value: tree.value,
      };
      balanceRight(newTree);
    }
  } else if (right.size !== 0) {
    const newRight = remove(right, value, cmp);
    if (newRight === right) {
      return tree;
    }
    newTree = {
      left,
      right: newRight,
      size: left.size + newRight.size + 1,
      value: tree.value,
    };
    balanceLeft(newTree);
  }

  if (newTree === null) {
    return tree;
  }

  return newTree;
}

export const removeIfExists/*: <T> (
  tree: ImmutableTree<T>,
  value: T,
  cmp: (a: T, b: T) => number,
) => ImmutableTree<T> */ = remove;

export function removeOrThrowIfNotExists/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
)/*: ImmutableTree<T> */ {
  const newTree = remove(tree, value, cmp);
  if (newTree === tree) {
    throw new ValueNotFoundError(value);
  }
  return newTree;
}
