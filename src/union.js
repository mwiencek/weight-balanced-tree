// @flow strict

import {ValueOrderError} from './errors.js';
import join from './join.js';
import split from './split.js';
/*::
import invariant from './invariant.js';
import type {ImmutableTree} from './types.js';
*/

export function onConflictUseSecondValue/*:: <T> */(
  v1/*: T */,
  v2/*: T */,
)/*: T */ {
  return v2;
}

export default function union/*:: <T> */(
  t1/*: ImmutableTree<T> */,
  t2/*: ImmutableTree<T> */,
  cmp/*: (a: T, b: T) => number */,
  onConflict/*:: ?: (v1: T, v2: T) => T */ = onConflictUseSecondValue,
)/*: ImmutableTree<T> */ {
  if (t1.size === 0) {
    return t2;
  }
  if (t2.size === 0) {
    return t1;
  }
  const [small, equal, large] = split(t2, t1.value, cmp);
  const leftUnion = union(t1.left, small, cmp, onConflict);
  const rightUnion = union(t1.right, large, cmp, onConflict);
  let unionValue = t1.value;
  if (equal.size) {
    unionValue = onConflict(t1.value, equal.value);
    if (
      !Object.is(unionValue, t1.value) &&
      !Object.is(unionValue, equal.value)
    ) {
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
  return join(leftUnion, unionValue, rightUnion);
}
