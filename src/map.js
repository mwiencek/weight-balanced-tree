// @flow strict

import empty from './empty.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export default function map/*:: <T, U> */(
  tree/*: ImmutableTree<T> */,
  mapper/*: (value: T) => U */,
)/*: ImmutableTree<U> */ {
  if (tree.size === 0) {
    return empty;
  }
  return {
    left: map(tree.left, mapper),
    right: map(tree.right, mapper),
    size: tree.size,
    value: mapper(tree.value),
  };
}
