// @flow strict

import maxNode from './maxNode.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export default function maxValue/*:: <T> */(
  tree/*: ImmutableTree<T> */,
)/*: T */ {
  return maxNode(tree).value;
}
