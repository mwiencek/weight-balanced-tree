// @flow strict

/*::
import type {ImmutableTree, NonEmptyImmutableTree} from './types.js';
*/

export default function findNode/*:: <T, K = T, D = T> */(
  tree/*: ImmutableTree<T> */,
  key/*: K */,
  cmp/*: (a: K, b: T) => number */,
)/*: NonEmptyImmutableTree<T> | null */ {
  let cursor = tree;
  while (cursor.size !== 0) {
    const order = cmp(key, cursor.value);
    if (order === 0) {
      return cursor;
    } else if (order < 0) {
      cursor = cursor.left;
    } else {
      cursor = cursor.right;
    }
  }
  return null;
}
