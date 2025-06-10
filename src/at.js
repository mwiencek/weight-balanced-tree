// @flow strict

/*::
import invariant from './invariant.js';
import type {ImmutableTree} from './types.js';
*/
import {IndexOutOfRangeError} from './errors.js';

export default function at/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  index/*: number */,
)/*: T */ {
  let adjustedIndex = index < 0 ? (tree.size + index) : index;
  if (adjustedIndex < 0 || adjustedIndex >= tree.size) {
    throw new IndexOutOfRangeError(adjustedIndex);
  }
  let cursor/*: ImmutableTree<T> */ = tree;
  while (cursor.size !== 0) {
    const leftSize = cursor.left.size;
    if (adjustedIndex < leftSize) {
      cursor = cursor.left;
    } else if (adjustedIndex == leftSize) {
      break;
    } else {
      adjustedIndex -= (leftSize + 1);
      cursor = cursor.right;
    }
  }
  /*:: invariant(cursor.size !== 0); */
  return cursor.value;
}
