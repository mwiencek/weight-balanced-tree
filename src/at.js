// @flow strict

/*::
import invariant from './invariant.js';
import type {ImmutableTree} from './types.js';
*/

export function getAdjustedIndex(
  tree/*: ImmutableTree<mixed> */,
  index/*: number */,
)/*: number */ {
  if (!Number.isInteger(index)) {
    return -1;
  }
  let adjustedIndex = index < 0 ? (tree.size + index) : index;
  if (adjustedIndex < 0 || adjustedIndex >= tree.size) {
    return -1;
  }
  return adjustedIndex;
}

export default function at/*:: <T, D = T> */(
  tree/*: ImmutableTree<T> */,
  index/*: number */,
  defaultValue/*: D */,
)/*: T | D */ {
  let adjustedIndex = getAdjustedIndex(tree, index);
  if (adjustedIndex === -1) {
    return defaultValue;
  }
  let cursor/*: ImmutableTree<T> */ = tree;
  while (cursor.size !== 0) {
    const leftSize = cursor.left.size;
    if (adjustedIndex < leftSize) {
      cursor = cursor.left;
    } else if (adjustedIndex == leftSize) {
      return cursor.value;
    } else {
      adjustedIndex -= (leftSize + 1);
      cursor = cursor.right;
    }
  }
  /*:: invariant(false); */
}
