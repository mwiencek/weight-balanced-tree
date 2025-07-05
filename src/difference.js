// @flow strict

import empty from './empty.js';
import join from './join.js';
import join2 from './join2.js';
import split from './split.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export default function difference/*:: <T> */(
  t1/*: ImmutableTree<T> */,
  t2/*: ImmutableTree<T> */,
  cmp/*: (a: T, b: T) => number */,
)/*: ImmutableTree<T> */ {
  if (t1.size === 0) {
    return empty;
  }
  if (t2.size === 0) {
    return t1;
  }
  const [small, equal, large] = split(t2, t1.value, cmp);
  const leftDifference = difference(t1.left, small, cmp);
  const rightDifference = difference(t1.right, large, cmp);
  if (equal.size) {
    return join2(leftDifference, rightDifference);
  } else {
    if (t1.left === leftDifference && t1.right == rightDifference) {
      return t1;
    } else {
      return join(leftDifference, t1.value, rightDifference);
    }
  }
}
