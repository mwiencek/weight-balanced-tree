// @flow strict

/*::
import type {ImmutableTree} from './types.js';
*/

export default function map/*:: <T, U> */(
  tree/*: ImmutableTree<T> | null */,
  mapper/*: (value: T) => U */,
)/*: ImmutableTree<U> | null */ {
  if (tree === null) {
    return null;
  }
  return {
    left: map(tree.left, mapper),
    right: map(tree.right, mapper),
    size: tree.size,
    value: mapper(tree.value),
  };
}
