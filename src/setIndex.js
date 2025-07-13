// @flow strict

import {node} from './create.js';
/*::
import invariant from './invariant.js';
import type {
  ImmutableTree,
  NonEmptyImmutableTree,
} from './types.js';
*/

function _setIndex/*:: <T> */(
  tree/*: NonEmptyImmutableTree<T> */,
  index/*: number */,
  value/*: T */,
  thisIndex/*: number */,
)/*: NonEmptyImmutableTree<T> */ {
  const left = tree.left;
  const right = tree.right;
  const order = index - thisIndex;
  if (order === 0) {
    if (Object.is(tree.value, value)) {
      return tree;
    }
    return node(left, value, right);
  } else if (order < 0) {
    /*:: invariant(left.size !== 0); */
    const newLeft = _setIndex(left, index, value, thisIndex - left.right.size - 1);
    if (newLeft === left) {
      return tree;
    }
    return node(newLeft, tree.value, right);
  } else {
    /*:: invariant(right.size !== 0); */
    const newRight = _setIndex(right, index, value, thisIndex + right.left.size + 1);
    if (newRight === right) {
      return tree;
    }
    return node(left, tree.value, newRight);
  }
}

export default function setIndex/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  index/*: number */,
  value/*: T */,
)/*: ImmutableTree<T> */ {
  if (!Number.isInteger(index)) {
    return tree;
  }
  let adjustedIndex = index;
  if (adjustedIndex < 0) {
    adjustedIndex += tree.size;
  }
  if (adjustedIndex < 0 || adjustedIndex >= tree.size) {
    return tree;
  }
  /*:: invariant(tree.size !== 0); */
  return _setIndex(tree, adjustedIndex, value, tree.left.size);
}
