// @flow strict

/*::
import type {ImmutableTree} from './types.mjs';
*/

export default function findBy/*:: <T, D = T> */(
  tree/*: ImmutableTree<T> | null */,
  cmp/*: (treeValue: T) => number */,
  defaultValue/*: D */,
)/*: T | D */ {
  let cursor = tree;
  while (cursor !== null) {
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
