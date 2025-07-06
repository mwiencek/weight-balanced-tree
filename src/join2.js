// @flow strict

import join from './join.js';
import splitLast from './splitLast.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export default function join2/*:: <T> */(
  left/*: ImmutableTree<T> */,
  right/*: ImmutableTree<T> */,
)/*: ImmutableTree<T> */ {
  if (left.size === 0) {
    return right;
  }
  if (right.size === 0) {
    return left;
  }
  const {tree: newLeft, value} = splitLast(left);
  return join(newLeft, value, right);
}
