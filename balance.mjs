// @flow strict

/*::
import type {MutableTree} from './types.mjs';
import invariant from './invariant.mjs';
*/

/*
 * DELTA and RATIO are taken from GHC:
 * https://gitlab.haskell.org/ghc/packages/containers/-/blob/f00aa02/containers/src/Data/Map/Internal.hs#L4011-4017
 */
const DELTA = 3;
const RATIO = 2;

export function rotateLeft/*:: <T> */(a/*: MutableTree<T> */)/*: void */ {
  const b = a.right;
  /*:: invariant(b); */
  const c = b.right;
  /*:: invariant(c); */
  const left = {
    left: a.left,
    right: b.left,
    size: (a.left === null ? 0 : a.left.size) + (b.left === null ? 0 : b.left.size) + 1,
    value: a.value,
  };
  a.left = left;
  a.right = c;
  a.size = left.size + c.size + 1;
  a.value = b.value;
}

export function rotateRight/*:: <T> */(c/*: MutableTree<T> */)/*: void */ {
  const b = c.left;
  /*:: invariant(b); */
  const a = b.left;
  /*:: invariant(a); */
  const right = {
    left: b.right,
    right: c.right,
    size: (b.right === null ? 0 : b.right.size) + (c.right === null ? 0 : c.right.size) + 1,
    value: c.value,
  };
  c.left = a;
  c.right = right;
  c.size = a.size + right.size + 1;
  c.value = b.value;
}

export function rotateLeftRight/*:: <T> */(tree/*: MutableTree<T> */)/*: void */ {
  const a = tree.left;
  /*:: invariant(a); */
  const b = a.right;
  /*:: invariant(b); */
  const c = b.right;
  /*:: invariant(c); */
  const left = {
    left: a.left,
    right: b.left,
    size: (a.left === null ? 0 : a.left.size) + (b.left === null ? 0 : b.left.size) + 1,
    value: a.value,
  };
  const right = {
    left: c,
    right: tree.right,
    size: (c === null ? 0 : c.size) + (tree.right === null ? 0 : tree.right.size) + 1,
    value: tree.value,
  };
  tree.left = left;
  tree.right = right;
  tree.size = left.size + right.size + 1;
  tree.value = b.value;
}

export function rotateRightLeft/*:: <T> */(tree/*: MutableTree<T> */)/*: void */ {
  const c = tree.right;
  /*:: invariant(c); */
  const b = c.left;
  /*:: invariant(b); */
  const a = b.left;
  /*:: invariant(a); */
  const right = {
    left: b.right,
    right: c.right,
    size: (b.right === null ? 0 : b.right.size) + (c.right === null ? 0 : c.right.size) + 1,
    value: c.value,
  };
  const left = {
    left: tree.left,
    right: a,
    size: (tree.left === null ? 0 : tree.left.size) + (a === null ? 0 : a.size) + 1,
    value: tree.value,
  };
  tree.left = left;
  tree.right = right;
  tree.size = left.size + right.size + 1;
  tree.value = b.value;
}

export function balanceLeft/*:: <T> */(tree/*: MutableTree<T> */)/*: void */ {
  const left = tree.left;
  const right = tree.right;
  const leftSize = (left === null ? 0 : left.size);
  const rightSize = (right === null ? 0 : right.size);

  if ((leftSize + rightSize) >= 2 && leftSize > (DELTA * rightSize)) {
    /*:: invariant(left); */
    if ((left.right === null ? 0 : left.right.size) < (RATIO * (left.left === null ? 0 : left.left.size))) {
      rotateRight(tree);
    } else {
      rotateLeftRight(tree);
    }
  }
}

export function balanceRight/*:: <T> */(tree/*: MutableTree<T> */)/*: void */ {
  const left = tree.left;
  const right = tree.right;
  const leftSize = (left === null ? 0 : left.size);
  const rightSize = (right === null ? 0 : right.size);

  if ((leftSize + rightSize) >= 2 && rightSize > (DELTA * leftSize)) {
    /*:: invariant(right); */
    if ((right.left === null ? 0 : right.left.size) < (RATIO * (right.right === null ? 0 : right.right.size))) {
      rotateLeft(tree);
    } else {
      rotateRightLeft(tree);
    }
  }
}
