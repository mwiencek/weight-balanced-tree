// @flow strict

import findNode from './findNode.js';
import iterate from './iterate.js';
/*::
import invariant from './invariant.js';
import type {ImmutableTree, NonEmptyImmutableTree} from './types.js';
*/

function isDisjointFromLockstep/*:: <T> */(
  tree/*: NonEmptyImmutableTree<T> */,
  other/*: NonEmptyImmutableTree<T> */,
  cmp/*: (a: T, b: T) => number */,
)/*: boolean */ {
  const treeIterator = iterate(tree);
  const otherIterator = iterate(other);
  let treeResult = treeIterator.next();
  let otherResult = otherIterator.next();
  while (!treeResult.done && !otherResult.done) {
    const order = cmp(treeResult.value, otherResult.value);
    if (order < 0) {
      treeResult = treeIterator.next();
    } else if (order > 0) {
      otherResult = otherIterator.next();
    } else {
      return false;
    }
  }
  return true;
}

export default function isDisjointFrom/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  other/*: ImmutableTree<T> */,
  cmp/*: (a: T, b: T) => number */,
)/*: boolean */ {
  if (tree.size === 0 || other.size === 0) {
    return true;
  }
  const [smaller, larger] = tree.size < other.size
    ? [tree, other]
    : [other, tree];
  if (((larger.size / smaller.size) + 1) < Math.log2(larger.size)) {
    return isDisjointFromLockstep(tree, other, cmp);
  }
  for (const value of iterate(smaller)) {
    if (findNode(larger, value, cmp) !== null) {
      return false;
    }
  }
  return true;
}
