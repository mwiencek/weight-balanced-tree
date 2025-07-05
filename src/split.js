// @flow strict

import empty from './empty.js';
import join from './join.js';
/*::
import type {ImmutableTree} from './types.js';

export type SplitResult<+T> = [
  +small: ImmutableTree<T>,
  +equal: ImmutableTree<T>,
  +large: ImmutableTree<T>,
];
*/

export default function split/*:: <T, K = T> */(
  tree/*: ImmutableTree<T> */,
  key/*: K */,
  cmp/*: (a: K, b: T) => number */,
)/*:: : SplitResult<T> */ {
  if (tree.size === 0) {
    return [empty, empty, empty];
  }
  const order = cmp(key, tree.value);
  if (order === 0) {
    return [tree.left, tree, tree.right];
  }
  if (order < 0) {
    const [small, equal, largeLeft] = split(tree.left, key, cmp);
    if (small.size === 0 && equal.size === 0) {
      return [empty, empty, tree];
    } else {
      return [small, equal, join(largeLeft, tree.value, tree.right)];
    }
  } else {
    const [smallRight, equal, large] = split(tree.right, key, cmp);
    if (equal.size === 0 && large.size === 0) {
      return [tree, empty, empty];
    } else {
      return [join(tree.left, tree.value, smallRight), equal, large];
    }
  }
}
