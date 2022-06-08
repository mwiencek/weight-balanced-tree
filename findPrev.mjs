// @flow strict

import maxNode from './maxNode.mjs';
/*::
import type {ImmutableTree} from './types.mjs';
*/

export default function findPrev/*:: <T, V = T> */(
  tree/*: ImmutableTree<T> | null */,
  value/*: V */,
  cmp/*: (a: V, b: T) => number */,
)/*: ImmutableTree<T> | null */ {
  let cursor = tree;
  let smallerParent = null;
  while (cursor !== null) {
    const order = cmp(value, cursor.value);
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
    return maxNode(cursor.left);
  }
  return smallerParent;
}
