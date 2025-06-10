// @flow strict

import empty from './empty.js';
import maxNode from './maxNode.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export default function findPrev/*:: <T, K = T, D = T> */(
  tree/*: ImmutableTree<T> */,
  key/*: K */,
  cmp/*: (a: K, b: T) => number */,
  defaultValue/*: D */,
)/*: T | D */ {
  let cursor = tree;
  let smallerParent/*: ImmutableTree<T> */ = empty;
  while (cursor.size !== 0) {
    const order = cmp(key, cursor.value);
    if (order === 0) {
      break;
    } else if (order < 0) {
      cursor = cursor.left;
    } else {
      smallerParent = cursor;
      cursor = cursor.right;
    }
  }
  if (cursor.size !== 0 && cursor.left.size !== 0) {
    return maxNode(cursor.left).value;
  }
  if (smallerParent.size !== 0) {
    return smallerParent.value;
  }
  return defaultValue;
}
