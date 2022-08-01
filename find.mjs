// @flow strict

/*::
import type {ImmutableTree} from './types.mjs';
*/

export default function find/*:: <T, K = T, D = T> */(
  tree/*: ImmutableTree<T> | null */,
  key/*: K */,
  cmp/*: (a: K, b: T) => number */,
  defaultValue/*: D */,
)/*: T | D */ {
  let cursor = tree;
  while (cursor !== null) {
    const order = cmp(key, cursor.value);
    if (order === 0) {
      return cursor.value;
    } else if (order < 0) {
      cursor = cursor.left;
    } else {
      cursor = cursor.right;
    }
  }
  return defaultValue;
}
