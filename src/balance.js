// @flow strict

import {node} from './create.js';
/*::
import type {ImmutableTree, MutableTree} from './types.js';
import invariant from './invariant.js';
*/

let DELTA/*: number */ = 3;

export function setDelta(delta/*: number */)/*: void */ {
  DELTA = delta;
}

export function rotateLeft/*:: <T> */(tree/*: MutableTree<T> */)/*: void */ {
  const right = tree.right;
  /*:: invariant(right.size !== 0); */
  const left = node(tree.left, tree.value, right.left);
  tree.left = left;
  tree.right = right.right;
  tree.size = left.size + right.right.size + 1;
  tree.value = right.value;
}

export function rotateRight/*:: <T> */(tree/*: MutableTree<T> */)/*: void */ {
  const left = tree.left;
  /*:: invariant(left.size !== 0); */
  const right = node(left.right, tree.value, tree.right);
  tree.left = left.left;
  tree.right = right;
  tree.size = left.left.size + right.size + 1;
  tree.value = left.value;
}

export function rotateLeftRight/*:: <T> */(tree/*: MutableTree<T> */)/*: void */ {
  const left = tree.left;
  /*:: invariant(left.size !== 0); */
  const leftRight = left.right;
  /*:: invariant(leftRight.size !== 0); */
  const newLeft = node(left.left, left.value, leftRight.left);
  const newRight = node(leftRight.right, tree.value, tree.right);
  tree.left = newLeft;
  tree.right = newRight;
  tree.size = newLeft.size + newRight.size + 1;
  tree.value = leftRight.value;
}

export function rotateRightLeft/*:: <T> */(tree/*: MutableTree<T> */)/*: void */ {
  const right = tree.right;
  /*:: invariant(right.size !== 0); */
  const rightLeft = right.left;
  /*:: invariant(rightLeft.size !== 0); */
  const newRight = node(rightLeft.right, right.value, right.right);
  const newLeft = node(tree.left, tree.value, rightLeft.left);
  tree.left = newLeft;
  tree.right = newRight;
  tree.size = newLeft.size + newRight.size + 1;
  tree.value = rightLeft.value;
}

export function heavy(w1/*: number */, w2/*: number */)/*: boolean */ {
  return w1 > (DELTA * w2);
}

export function balanceLeft/*:: <T> */(
  tree/*: MutableTree<T> */,
)/*: ImmutableTree<T> */ {
  const left = tree.left;
  const right = tree.right;
  /*:: invariant((left.size + right.size) >= 2); */
  if (heavy(left.size, right.size)) {
    if (
      heavy(left.right.size, right.size) ||
      heavy(left.right.size + right.size + 1, left.left.size)
    ) {
      rotateLeftRight(tree);
    } else {
      rotateRight(tree);
    }
  }
  return tree;
}

export function balanceRight/*:: <T> */(
  tree/*: MutableTree<T> */,
)/*: ImmutableTree<T> */ {
  const left = tree.left;
  const right = tree.right;
  /*:: invariant((left.size + right.size) >= 2); */
  if (heavy(right.size, left.size)) {
    if (
      heavy(right.left.size, left.size) ||
      heavy(right.left.size + left.size + 1, right.right.size)
    ) {
      rotateRightLeft(tree);
    } else {
      rotateLeft(tree);
    }
  }
  return tree;
}
