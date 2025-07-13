// @flow strict

/*::
import invariant from './invariant.js';
import type {ImmutableTree} from './types.js';
*/

export default function at/*:: <T, D = T> */(
  tree/*: ImmutableTree<T> */,
  index/*: number */,
  defaultValue/*: D */,
)/*: T | D */ {
  if (!Number.isInteger(index)) {
    return defaultValue;
  }
  let adjustedIndex = index < 0 ? (tree.size + index) : index;
  if (adjustedIndex < 0 || adjustedIndex >= tree.size) {
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
