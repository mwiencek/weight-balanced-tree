// @flow strict

import findNode from './findNode.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export default function find/*:: <T, K = T, D = T> */(
  tree/*: ImmutableTree<T> */,
  key/*: K */,
  cmp/*: (a: K, b: T) => number */,
  defaultValue/*: D */,
)/*: T | D */ {
  const node = findNode(tree, key, cmp);
  if (node !== null && node.size !== 0) {
    return node.value;
  }
  return defaultValue;
}
