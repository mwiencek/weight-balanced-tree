// @flow strict

import empty from './empty.js';
import join from './join.js';
import safeSize from './utility/safeSize.js';
/*::
import type {ImmutableTree} from './types.js';

export type SplitResult<+T> = [
  +small: ImmutableTree<T>,
  +equal: ImmutableTree<T>,
  +large: ImmutableTree<T>,
];
*/

export function _splitInternal/*:: <T, K = T> */(
  tree/*: ImmutableTree<T> */,
  key/*: K */,
  cmp/*: (a: K, b: T, index: number) => number */,
  index/*: number */,
)/*: SplitResult<T> */ {
  if (tree.size === 0) {
    return [empty, empty, empty];
  }
  const left = tree.left;
  const right = tree.right;
  const order = cmp(key, tree.value, index);
  if (order === 0) {
    return [left, tree, right];
  }
  if (order < 0) {
    const [small, equal, largeLeft] = _splitInternal(
      left,
      key,
      cmp,
      index - safeSize(left.right) - 1,
    );
    if (small.size === 0 && equal.size === 0) {
      return [empty, empty, tree];
    } else {
      return [small, equal, join(largeLeft, tree.value, right)];
    }
  } else {
    const [smallRight, equal, large] = _splitInternal(
      right,
      key,
      cmp,
      index + safeSize(right.left) + 1,
    );
    if (equal.size === 0 && large.size === 0) {
      return [tree, empty, empty];
    } else {
      return [join(left, tree.value, smallRight), equal, large];
    }
  }
}

export default function split/*:: <T, K = T> */(
  tree/*: ImmutableTree<T> */,
  key/*: K */,
  cmp/*: (a: K, b: T, index: number) => number */,
)/*: SplitResult<T> */ {
  return _splitInternal(
    tree,
    key,
    cmp,
    safeSize(tree.left),
  );
}
