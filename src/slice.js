// @flow strict

import empty from './empty.js';
import join from './join.js';
import join2 from './join2.js';
import getSliceArgs from './utility/getSliceArgs.js';
import safeSize from './utility/safeSize.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export function _slice/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  start/*: number */,
  end/*: number */,
  index/*: number */,
)/*: ImmutableTree<T> */ {
  if (tree.size === 0 || start >= end) {
    return empty;
  }
  const left = tree.left;
  const right = tree.right;
  const leftIndex = index - safeSize(left.right) - 1;
  const leftStart = leftIndex - safeSize(left.left);
  const leftEnd = index;
  const rightIndex = index + safeSize(right.left) + 1;
  const rightStart = index + 1;
  const rightEnd = rightIndex + safeSize(right.right) + 1;
  const newLeft = (leftStart >= start && leftEnd <= end)
    ? left
    : _slice(left, Math.max(start, leftStart), Math.min(end, leftEnd), leftIndex);
  const newRight = (rightStart >= start && rightEnd <= end)
    ? right
    : _slice(right, Math.max(start, rightStart), Math.min(end, rightEnd), rightIndex);
  if (index >= start && index < end) {
    if (newLeft === left && newRight === right) {
      return tree;
    }
    return join(newLeft, tree.value, newRight);
  }
  return join2(newLeft, newRight);
}

export default function slice/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  start/*:: ?: number */,
  end/*:: ?: number */
)/*: ImmutableTree<T> */ {
  const {actualStart, actualEnd} = getSliceArgs(tree, start, end);
  return _slice(tree, actualStart, actualEnd, safeSize(tree.left));
}
