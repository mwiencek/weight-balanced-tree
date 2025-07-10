// @flow strict

import findNode from './findNode.js';
import iterate from './iterate.js';
/*::
import invariant from './invariant.js';
import type {ImmutableTree, NonEmptyImmutableTree} from './types.js';
*/

function isSubsetOfLockstep/*:: <T> */(
  tree/*: NonEmptyImmutableTree<T> */,
  other/*: NonEmptyImmutableTree<T> */,
  cmp/*: (a: T, b: T) => number */,
)/*: boolean */ {
  /*:: invariant(tree.size <= other.size); */
  const treeIterator = iterate(tree);
  const otherIterator = iterate(other);
  let treeResult = treeIterator.next();
  let otherResult = otherIterator.next();
  while (!treeResult.done) {
    if (otherResult.done) {
      return false;
    }
    const order = cmp(treeResult.value, otherResult.value);
    if (order < 0) {
      return false;
    } else if (order > 0) {
      otherResult = otherIterator.next();
    } else {
      treeResult = treeIterator.next();
      otherResult = otherIterator.next();
    }
  }
  return true;
}

export default function isSubsetOf/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  other/*: ImmutableTree<T> */,
  cmp/*: (a: T, b: T) => number */,
)/*: boolean */ {
  if (tree.size === 0) {
    return true;
  }
  if (tree.size > other.size) {
    return false;
  }
  /*:: invariant(other.size !== 0); */
  if (((other.size / tree.size) + 1) < Math.log2(other.size)) {
    // This path is faster when `tree.size` is a large fraction of `other.size`.
    return isSubsetOfLockstep(tree, other, cmp);
  }
  for (const value of iterate(tree)) {
    const node = findNode(other, value, cmp);
    if (node === null) {
      return false;
    }
  }
  return true;
}
