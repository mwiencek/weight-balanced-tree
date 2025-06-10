// @flow strict

/*::
import type {ImmutableTree} from './types.js';
*/

export default function findBy/*:: <T, D = T> */(
  tree/*: ImmutableTree<T> */,
  cmp/*: (treeValue: T) => number */,
  defaultValue/*: D */,
)/*: T | D */ {
  let cursor = tree;
  while (cursor.size !== 0) {
    const order = cmp(cursor.value);
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
