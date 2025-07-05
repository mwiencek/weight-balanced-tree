// @flow strict

import empty from './empty.js';
import {ValueOrderError} from './errors.js';
import join from './join.js';
import join2 from './join2.js';
import split from './split.js';
/*::
import invariant from './invariant.js';
import type {ImmutableTree} from './types.js';
*/

export default function intersection/*:: <T> */(
  t1/*: ImmutableTree<T> */,
  t2/*: ImmutableTree<T> */,
  cmp/*: (a: T, b: T) => number */,
  combiner/*:: ?: (v1: T, v2: T) => T */ = (v1) => v1,
)/*: ImmutableTree<T> */ {
  if (t1.size === 0 || t2.size === 0) {
    return empty;
  }
  const [small, equal, large] = split(t2, t1.value, cmp);
  const leftIntersection = intersection(t1.left, small, cmp, combiner);
  const rightIntersection = intersection(t1.right, large, cmp, combiner);
  if (equal.size) {
    const combinedValue = combiner(t1.value, equal.value);
    const leftIsEqual = Object.is(combinedValue, t1.value);
    const rightIsEqual = Object.is(combinedValue, equal.value);
    if (!leftIsEqual && !rightIsEqual) {
      if (
        leftIntersection.size !== 0 &&
        cmp(combinedValue, leftIntersection.value) <= 0
      ) {
        throw new ValueOrderError(combinedValue, leftIntersection.value, 'greater than');
      }
      if (
        rightIntersection.size !== 0 &&
        cmp(combinedValue, rightIntersection.value) >= 0
      ) {
        throw new ValueOrderError(combinedValue, rightIntersection.value, 'less than');
      }
    }
    if (t1.left === leftIntersection && t1.right === rightIntersection && leftIsEqual) {
      return t1;
    }
    if (t2.left === leftIntersection && t2.right === rightIntersection && rightIsEqual) {
      /*:: invariant(t2 === equal); */
      return t2;
    }
    return join(leftIntersection, combinedValue, rightIntersection);
  } else {
    return join2(leftIntersection, rightIntersection);
  }
}
