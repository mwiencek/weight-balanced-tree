// @flow strict

import join from './join.js';
/*::
import type {ImmutableTree, NonEmptyImmutableTree} from './types.js';
*/

export default function splitFirst/*:: <T> */(
  tree/*: NonEmptyImmutableTree<T> */,
)/*: {+tree: ImmutableTree<T>, +value: T} */ {
  if (tree.left.size === 0) {
    return {tree: tree.right, value: tree.value};
  }
  const {tree: newLeft, value: firstValue} = splitFirst(tree.left);
  return {
    tree: join(newLeft, tree.value, tree.right),
    value: firstValue,
  };
}
