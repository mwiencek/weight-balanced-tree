// @flow strict

import {node} from './create.js';
import {updateLeft, updateRight} from './update.js';
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
    return updateLeft(tree, _setIndex(left, index, value, thisIndex - left.right.size - 1));
  } else {
    /*:: invariant(right.size !== 0); */
    return updateRight(tree, _setIndex(right, index, value, thisIndex + right.left.size + 1));
  }
}

export default function setIndex/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  index/*: number */,
  value/*: T */,
)/*: ImmutableTree<T> */ {
  let adjustedIndex = index < 0 ? (tree.size + index) : index;
  if (adjustedIndex < 0 || adjustedIndex >= tree.size) {
    return tree;
  }
  /*:: invariant(tree.size !== 0); */
  return _setIndex(tree, adjustedIndex, value, tree.left.size);
}
