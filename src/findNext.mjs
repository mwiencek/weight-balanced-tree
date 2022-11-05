// @flow strict

import minNode from './minNode.mjs';
/*::
import type {ImmutableTree} from './types.mjs';
*/

export default function findNext/*:: <T, K = T, D = T> */(
  tree/*: ImmutableTree<T> | null */,
  key/*: K */,
  cmp/*: (a: K, b: T) => number */,
  defaultValue/*: D */,
)/*: T | D */ {
  let cursor = tree;
  let largerParent = null;
  while (cursor !== null) {
    const order = cmp(key, cursor.value);
    if (order === 0) {
      break;
    } else if (order < 0) {
      largerParent = cursor;
      cursor = cursor.left;
    } else {
      cursor = cursor.right;
    }
  }
  if (cursor !== null && cursor.right !== null) {
    return minNode(cursor.right).value;
  }
  if (largerParent !== null) {
    return largerParent.value;
  }
  return defaultValue;
}
