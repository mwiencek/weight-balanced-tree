// @flow strict

/*::
import type {ImmutableTree} from './types.js';
*/

export default function indexOf/*:: <T, K = T> */(
  tree/*: ImmutableTree<T> | null */,
  key/*: K */,
  cmp/*: (a: K, b: T) => number */,
)/*: number */ {
  let cursor = tree;
  let index = cursor === null ? -1 : (cursor.left === null ? 0 : cursor.left.size);
  while (cursor !== null) {
    const order = cmp(key, cursor.value);
    if (order === 0) {
      return index;
    } else if (order < 0) {
      cursor = cursor.left;
      if (cursor !== null) {
        index -= ((cursor.right === null ? 0 : cursor.right.size) + 1);
      }
    } else {
      cursor = cursor.right;
      if (cursor !== null) {
        index += ((cursor.left === null ? 0 : cursor.left.size) + 1);
      }
    }
  }
  return -1;
}
