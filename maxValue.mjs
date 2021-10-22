// @flow strict

import maxNode from './maxNode.mjs';
/*::
import type {ImmutableTree} from './types.mjs';
*/

export default function maxValue/*:: <T> */(
  tree/*: ImmutableTree<T> */,
)/*: T */ {
  return maxNode(tree).value;
}
