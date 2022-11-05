// @flow strict

import checkOrder from './checkOrder.mjs';
import fromDistinctAscArray from './fromDistinctAscArray.mjs';
import iterate from './iterate.mjs';
/*::
import invariant from './invariant.mjs';
import type {ImmutableTree} from './types.mjs';
*/

export function onConflictUseSecondValue/*:: <T> */(
  v1/*: T */,
  v2/*: T */,
)/*: T */ {
  return v2;
}

export default function union/*:: <T> */(
  t1/*: ImmutableTree<T> | null */,
  t2/*: ImmutableTree<T> | null */,
  cmp/*: (a: T, b: T) => number */,
  onConflict/*:: ?: (v1: T, v2: T) => T */ = onConflictUseSecondValue,
)/*: ImmutableTree<T> | null */ {
  const arrayUnion/*: Array<T> */ = [],
        iter1 = iterate(t1),
        iter2 = iterate(t2);
  let r1 = null, r2 = null;

  while (true) {
    if (!r1) {
      r1 = iter1.next();
    }
    if (!r2) {
      r2 = iter2.next();
    }

    if (r1.done && r2.done) {
      break;
    } else if (r1.done) {
      /*:: invariant(!r2.done); */
      arrayUnion.push(r2.value);
      r2 = null;
    } else if (r2.done) {
      arrayUnion.push(r1.value);
      r1 = null;
    } else {
      const order = cmp(r1.value, r2.value);
      if (order < 0) {
        arrayUnion.push(r1.value);
        r1 = null;
      } else if (order > 0) {
        arrayUnion.push(r2.value);
        r2 = null;
      } else {
        const unionValue = onConflict(r1.value, r2.value);
        if (
          !Object.is(unionValue, r1.value) &&
          !Object.is(unionValue, r2.value)
        ) {
          checkOrder(
            /* expected = */ r1.value,
            /* got = */ unionValue,
            cmp,
          );
        }
        arrayUnion.push(unionValue);
        r1 = null;
        r2 = null;
      }
    }
  }

  return fromDistinctAscArray(arrayUnion);
}
