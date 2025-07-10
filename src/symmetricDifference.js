// @flow strict

import join from './join.js';
import join2 from './join2.js';
import split from './split.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export default function symmetricDifference/*:: <T> */(
  t1/*: ImmutableTree<T> */,
  t2/*: ImmutableTree<T> */,
  cmp/*: (a: T, b: T) => number */,
)/*: ImmutableTree<T> */ {
  if (t1.size === 0) {
    return t2;
  }
  if (t2.size === 0) {
    return t1;
  }
  const [small, equal, large] = split(t2, t1.value, cmp);
  const left = symmetricDifference(t1.left, small, cmp);
  const right = symmetricDifference(t1.right, large, cmp);
  if (equal.size) {
    return join2(left, right);
  }
  return join(left, t1.value, right);
}
