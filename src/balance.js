// @flow strict

import {node} from './create.js';
/*::
import type {ImmutableTree, MutableTree} from './types.js';
import invariant from './invariant.js';
*/

/*
 * DELTA and RATIO are taken from GHC:
 * https://gitlab.haskell.org/ghc/packages/containers/-/blob/f00aa02/containers/src/Data/Map/Internal.hs#L4011-4017
 */
export let DELTA/*: number */ = 3;
export let RATIO/*: number */ = 2;

export function setBalancingParameters(
  delta/*: number */,
  ratio/*: number */,
)/*: void */ {
  DELTA = delta;
  RATIO = ratio;
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

export function balanceLeft/*:: <T> */(
  tree/*: MutableTree<T> */,
)/*: ImmutableTree<T> */ {
  if (
    (tree.left.size + tree.right.size) >= 2 &&
    tree.left.size > (DELTA * tree.right.size)
  ) {
    if (tree.left.right.size < (RATIO * tree.left.left.size)) {
      rotateRight(tree);
    } else {
      rotateLeftRight(tree);
    }
  }
  return tree;
}

export function balanceRight/*:: <T> */(
  tree/*: MutableTree<T> */,
)/*: ImmutableTree<T> */ {
  if (
    (tree.left.size + tree.right.size) >= 2 &&
    tree.right.size > (DELTA * tree.left.size)
  ) {
    if (tree.right.left.size < (RATIO * tree.right.right.size)) {
      rotateLeft(tree);
    } else {
      rotateRightLeft(tree);
    }
  }
  return tree;
}
