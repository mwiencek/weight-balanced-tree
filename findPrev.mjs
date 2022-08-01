// @flow strict

import maxNode from './maxNode.mjs';
/*::
import type {ImmutableTree} from './types.mjs';
*/

export default function findPrev/*:: <T, K = T, D = T> */(
  tree/*: ImmutableTree<T> | null */,
  key/*: K */,
  cmp/*: (a: K, b: T) => number */,
  defaultValue/*: D */,
)/*: T | D */ {
  let cursor = tree;
  let smallerParent = null;
  while (cursor !== null) {
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
  if (cursor !== null && cursor.left !== null) {
    return maxNode(cursor.left).value;
  }
  if (smallerParent !== null) {
    return smallerParent.value;
  }
  return defaultValue;
}
