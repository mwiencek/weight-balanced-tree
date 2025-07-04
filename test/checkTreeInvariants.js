// @flow strict

import {heavy} from '../src/balance.js';
import validate from '../src/validate.js';
/*::
import type {ImmutableTree} from '../src/types.js';
*/

function countSize(
  tree/*: ImmutableTree<mixed> */,
)/*: number */ {
  if (tree.size === 0) {
    return 0;
  }
  return 1 + countSize(tree.left) + countSize(tree.right);
}

function getSize(
  tree/*: ImmutableTree<mixed> | null */,
)/*: number */ {
  if (tree === null) {
    return 0;
  }
  return tree.size;
}

function checkBalance(
  tree/*: ImmutableTree<mixed> */,
)/*: boolean */ {
  if (getSize(tree.left) <= 1 && getSize(tree.right) <= 1) {
    return true;
  }
  /* c8 ignore start */
  return !(
    heavy(getSize(tree.left), getSize(tree.right)) ||
    heavy(getSize(tree.right), getSize(tree.left))
  );
  /* c8 ignore stop */
}

export default function checkTreeInvariants/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  cmp/*: (T, T) => number */,
)/*: boolean */ {
  if (tree.size === 0) {
    return true;
  }

  const actualSize = countSize(tree);
  /* c8 ignore start */
  if (tree.size !== actualSize) {
    throw Error('Wrong tree size');
  }
  /* c8 ignore stop */

  const isBalanced = checkBalance(tree);
  /* c8 ignore start */
  if (!isBalanced) {
    throw Error('Unbalanced tree');
  }
  /* c8 ignore stop */

  const validateResult = validate(tree, cmp);
  if (!validateResult.valid) {
    throw Error(`Invalid ${validateResult.subtree} subtree`);
  }

  if (tree.left) {
    checkTreeInvariants(tree.left, cmp);
  }

  if (tree.right) {
    checkTreeInvariants(tree.right, cmp);
  }

  return true;
}
