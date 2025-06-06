// @flow strict

import minNode from './minNode.mjs';
/*::
import type {ImmutableTree} from './types.mjs';
*/

export default function minValue/*:: <T> */(
  tree/*: ImmutableTree<T> */,
)/*: T */ {
  return minNode(tree).value;
}
