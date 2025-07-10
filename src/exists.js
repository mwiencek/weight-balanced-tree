// @flow strict

import findNode from './findNode.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export default function exists/*:: <T, K = T> */(
  tree/*: ImmutableTree<T> */,
  key/*: K */,
  cmp/*: (a: K, b: T) => number */,
)/*: boolean */ {
  return findNode(tree, key, cmp) !== null;
}
