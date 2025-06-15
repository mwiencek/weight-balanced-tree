// @flow strict

import join from './join.js';
/*::
import type {
  ImmutableTree,
  NonEmptyImmutableTree,
} from './types.js';
*/

function splitLast/*:: <T> */(
  tree/*: NonEmptyImmutableTree<T> */,
)/*: {+tree: ImmutableTree<T>, +value: T} */ {
  if (tree.right.size === 0) {
    return {tree: tree.left, value: tree.value};
  }
  const {tree: newRight, value: lastValue} = splitLast(tree.right);
  return {
    tree: join(tree.left, tree.value, newRight),
    value: lastValue,
  };
}

export default function join2/*:: <T> */(
  left/*: ImmutableTree<T> */,
  right/*: ImmutableTree<T> */,
)/*: ImmutableTree<T> */ {
  if (left.size === 0) {
    return right;
  }
  const {tree: newLeft, value} = splitLast(left);
  return join(newLeft, value, right);
}
