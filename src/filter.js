// @flow strict

import empty from './empty.js';
import join from './join.js';
import join2 from './join2.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export default function filter/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  predicate/*: (value: T) => boolean */,
)/*: ImmutableTree<T> */ {
  if (tree.size === 0) {
    return empty;
  }
  const left = filter(tree.left, predicate);
  const right = filter(tree.right, predicate);
  if (predicate(tree.value)) {
    if (left === tree.left && right === tree.right) {
      return tree;
    }
    return join(left, tree.value, right);
  }
  return join2(left, right);
}
