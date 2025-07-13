// @flow strict

import {getAdjustedIndex} from './at.js';
import {node} from './create.js';
/*::
import invariant from './invariant.js';
import type {
  ImmutableTree,
  NonEmptyImmutableTree,
} from './types.js';

type SetIndexOptions<T> =
  | {
      +index: number,
      +value: T,
      +updater: null,
    }
  | {
      +index: number,
      +value: null,
      +updater: (existingTreeValue: T) => T,
    };
*/

function _updateLeft/*:: <T> */(
  tree/*: NonEmptyImmutableTree<T> */,
  thisIndex/*: number */,
  options/*: SetIndexOptions<T> */,
)/*: NonEmptyImmutableTree<T> */ {
  const left = tree.left;
  /*:: invariant(left.size !== 0); */
  const newLeft = _setIndexInternal(left, thisIndex - left.right.size - 1, options);
  if (newLeft === left) {
    return tree;
  }
  return node(newLeft, tree.value, tree.right);
}

function _updateRight/*:: <T> */(
  tree/*: NonEmptyImmutableTree<T> */,
  thisIndex/*: number */,
  options/*: SetIndexOptions<T> */,
)/*: NonEmptyImmutableTree<T> */ {
  const right = tree.right;
  /*:: invariant(right.size !== 0); */
  const newRight = _setIndexInternal(right, thisIndex + right.left.size + 1, options);
  if (newRight === right) {
    return tree;
  }
  return node(tree.left, tree.value, newRight);
}

function _updateValue/*:: <T> */(
  tree/*: NonEmptyImmutableTree<T> */,
  options/*: SetIndexOptions<T> */,
)/*: NonEmptyImmutableTree<T> */ {
  const valueToInsert/*: T */ = options.updater === null
    // $FlowIssue[incompatible-type]
    ? options.value
    : options.updater(tree.value);
  if (Object.is(tree.value, valueToInsert)) {
    return tree;
  }
  return node(tree.left, valueToInsert, tree.right);
}

export function _setIndexInternal/*:: <T> */(
  tree/*: NonEmptyImmutableTree<T> */,
  thisIndex/*: number */,
  options/*: SetIndexOptions<T> */,
)/*: NonEmptyImmutableTree<T> */ {
  const order = options.index - thisIndex;
  if (order === 0) {
    return _updateValue(tree, options);
  } else if (order < 0) {
    return _updateLeft(tree, thisIndex, options);
  } else {
    return _updateRight(tree, thisIndex, options);
  }
}

export default function setIndex/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  index/*: number */,
  value/*: T */,
)/*: ImmutableTree<T> */ {
  let adjustedIndex = getAdjustedIndex(tree, index);
  if (adjustedIndex === -1) {
    return tree;
  }
  /*:: invariant(tree.size !== 0); */
  return _setIndexInternal(tree, tree.left.size, {
    index: adjustedIndex,
    value,
    updater: null,
  });
}
