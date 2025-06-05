// @flow strict

import minNode from './minNode.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export default function minValue/*:: <T> */(
  tree/*: ImmutableTree<T> */,
)/*: T */ {
  return minNode(tree).value;
}
