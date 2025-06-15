// @flow strict

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

export function rotateLeft/*:: <T> */(a/*: MutableTree<T> */)/*: void */ {
  const b = a.right;
  /*:: invariant(b.size !== 0); */
  const c = b.right;
  /*:: invariant(c.size !== 0); */
  const left = {
    left: a.left,
    right: b.left,
    size: a.left.size + b.left.size + 1,
    value: a.value,
  };
  a.left = left;
  a.right = c;
  a.size = left.size + c.size + 1;
  a.value = b.value;
}

export function rotateRight/*:: <T> */(c/*: MutableTree<T> */)/*: void */ {
  const b = c.left;
  /*:: invariant(b.size !== 0); */
  const a = b.left;
  /*:: invariant(a.size !== 0); */
  const right = {
    left: b.right,
    right: c.right,
    size: b.right.size + c.right.size + 1,
    value: c.value,
  };
  c.left = a;
  c.right = right;
  c.size = a.size + right.size + 1;
  c.value = b.value;
}

export function rotateLeftRight/*:: <T> */(tree/*: MutableTree<T> */)/*: void */ {
  const a = tree.left;
  /*:: invariant(a.size !== 0); */
  const b = a.right;
  /*:: invariant(b.size !== 0); */
  const c = b.right;
  const left = {
    left: a.left,
    right: b.left,
    size: a.left.size + b.left.size + 1,
    value: a.value,
  };
  const right = {
    left: c,
    right: tree.right,
    size: c.size + tree.right.size + 1,
    value: tree.value,
  };
  tree.left = left;
  tree.right = right;
  tree.size = left.size + right.size + 1;
  tree.value = b.value;
}

export function rotateRightLeft/*:: <T> */(tree/*: MutableTree<T> */)/*: void */ {
  const c = tree.right;
  /*:: invariant(c.size !== 0); */
  const b = c.left;
  /*:: invariant(b.size !== 0); */
  const a = b.left;
  const right = {
    left: b.right,
    right: c.right,
    size: b.right.size + c.right.size + 1,
    value: c.value,
  };
  const left = {
    left: tree.left,
    right: a,
    size: tree.left.size + a.size + 1,
    value: tree.value,
  };
  tree.left = left;
  tree.right = right;
  tree.size = left.size + right.size + 1;
  tree.value = b.value;
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
