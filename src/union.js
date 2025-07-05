// @flow strict

import {ValueOrderError} from './errors.js';
import join from './join.js';
import split from './split.js';
/*::
import invariant from './invariant.js';
import type {ImmutableTree} from './types.js';
*/

export default function union/*:: <T> */(
  t1/*: ImmutableTree<T> */,
  t2/*: ImmutableTree<T> */,
  cmp/*: (a: T, b: T) => number */,
  combiner/*:: ?: (v1: T, v2: T) => T */ = (v1) => v1,
)/*: ImmutableTree<T> */ {
  if (t1.size === 0) {
    return t2;
  }
  if (t2.size === 0) {
    return t1;
  }
  const [small, equal, large] = split(t2, t1.value, cmp);
  const leftUnion = union(t1.left, small, cmp, combiner);
  const rightUnion = union(t1.right, large, cmp, combiner);
  let unionValue = t1.value;
  let leftIsEqual = true;
  let rightIsEqual = false;
  if (equal.size) {
    unionValue = combiner(t1.value, equal.value);
    leftIsEqual = Object.is(unionValue, t1.value);
    rightIsEqual = Object.is(unionValue, equal.value);
    if (!leftIsEqual && !rightIsEqual) {
      if (
        leftUnion.size !== 0 &&
        cmp(unionValue, leftUnion.value) <= 0
      ) {
        throw new ValueOrderError(unionValue, leftUnion.value, 'greater than');
      }
      if (
        rightUnion.size !== 0 &&
        cmp(unionValue, rightUnion.value) >= 0
      ) {
        throw new ValueOrderError(unionValue, rightUnion.value, 'less than');
      }
    }
  }
  if (t1.left === leftUnion && t1.right === rightUnion && leftIsEqual) {
    return t1;
  }
  if (t2.left === leftUnion && t2.right === rightUnion && rightIsEqual) {
    /*:: invariant(t2 === equal); */
    return t2;
  }
  return join(leftUnion, unionValue, rightUnion);
}
