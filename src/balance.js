// @flow strict

import {node} from './create.js';
/*::
import type {
  ImmutableTree,
  MutableTree,
  NonEmptyImmutableTree,
} from './types.js';
import invariant from './invariant.js';
*/

let DELTA/*: number */ = 3;

export function setDelta(delta/*: number */)/*: void */ {
  DELTA = delta;
}

export function heavy(w1/*: number */, w2/*: number */)/*: boolean */ {
  return w1 > (DELTA * w2);
}

export function balanceLeft/*:: <T> */(
  tree/*: MutableTree<T> */,
)/*: NonEmptyImmutableTree<T> */ {
  const left = tree.left;
  const right = tree.right;
  /*:: invariant(left.size !== 0); */
  /*:: invariant((left.size + right.size) >= 2); */
  if (heavy(left.size, right.size)) {
    if (
      heavy(left.right.size, right.size) ||
      heavy(left.right.size + right.size + 1, left.left.size)
    ) {
      // Perform a left-right rotation
      const leftRight = left.right;
      /*:: invariant(leftRight.size !== 0); */
      tree.left = node(left.left, left.value, leftRight.left);
      tree.right = node(leftRight.right, tree.value, right);
      tree.value = leftRight.value;
    } else {
      // Perform a right rotation
      tree.left = left.left;
      tree.right = node(left.right, tree.value, right);
      tree.value = left.value;
    }
    tree.size = tree.left.size + tree.right.size + 1;
  }
  return tree;
}

export function balanceRight/*:: <T> */(
  tree/*: MutableTree<T> */,
)/*: NonEmptyImmutableTree<T> */ {
  const left = tree.left;
  const right = tree.right;
  /*:: invariant(right.size !== 0); */
  /*:: invariant((left.size + right.size) >= 2); */
  if (heavy(right.size, left.size)) {
    if (
      heavy(right.left.size, left.size) ||
      heavy(right.left.size + left.size + 1, right.right.size)
    ) {
      // Perform a right-left rotation
      const rightLeft = right.left;
      /*:: invariant(rightLeft.size !== 0); */
      tree.left = node(left, tree.value, rightLeft.left);
      tree.right = node(rightLeft.right, right.value, right.right);
      tree.value = rightLeft.value;
    } else {
      // Perform a left rotation
      tree.left = node(left, tree.value, right.left);
      tree.right = right.right;
      tree.value = right.value;
    }
    tree.size = tree.left.size + tree.right.size + 1;
  }
  return tree;
}
