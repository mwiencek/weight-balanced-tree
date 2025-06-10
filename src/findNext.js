// @flow strict

import empty from './empty.js';
import minNode from './minNode.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export default function findNext/*:: <T, K = T, D = T> */(
  tree/*: ImmutableTree<T> */,
  key/*: K */,
  cmp/*: (a: K, b: T) => number */,
  defaultValue/*: D */,
)/*: T | D */ {
  let cursor = tree;
  let largerParent/*: ImmutableTree<T> */ = empty;
  while (cursor.size !== 0) {
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
  if (cursor.size !== 0 && cursor.right.size !== 0) {
    return minNode(cursor.right).value;
  }
  if (largerParent.size !== 0) {
    return largerParent.value;
  }
  return defaultValue;
}
