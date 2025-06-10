// @flow strict

import {EmptyTreeError} from './errors.js';
/*::
import type {ImmutableTree, NonEmptyImmutableTree} from './types.js';
*/

export default function maxNode/*:: <T> */(
  tree/*: ImmutableTree<T> */,
)/*: NonEmptyImmutableTree<T> */ {
  if (tree.size === 0) {
    throw new EmptyTreeError();
  }
  let node = tree;
  while (node.right.size !== 0) {
    node = node.right;
  }
  return node;
}
