// @flow strict

import isSubsetOf from './isSubsetOf.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export default function isSupersetOf/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  other/*: ImmutableTree<T> */,
  cmp/*: (a: T, b: T) => number */,
)/*: boolean */ {
  return isSubsetOf(other, tree, cmp);
}
