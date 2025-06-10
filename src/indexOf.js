// @flow strict

/*::
import type {ImmutableTree} from './types.js';
*/

export default function indexOf/*:: <T, K = T> */(
  tree/*: ImmutableTree<T> */,
  key/*: K */,
  cmp/*: (a: K, b: T) => number */,
)/*: number */ {
  let cursor = tree;
  let index = cursor.left.size;
  while (cursor.size !== 0) {
    const order = cmp(key, cursor.value);
    if (order === 0) {
      return index;
    } else if (order < 0) {
      cursor = cursor.left;
      if (cursor.size !== 0) {
        index -= (cursor.right.size + 1);
      }
    } else {
      cursor = cursor.right;
      if (cursor.size !== 0) {
        index += (cursor.left.size + 1);
      }
    }
  }
  return -1;
}
