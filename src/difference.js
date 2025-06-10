// @flow strict

import fromDistinctAscArray from './fromDistinctAscArray.js';
import iterate from './iterate.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export default function difference/*:: <T> */(
  t1/*: ImmutableTree<T> */,
  t2/*: ImmutableTree<T> */,
  cmp/*: (a: T, b: T) => number */,
)/*: ImmutableTree<T> */ {
  const arrayDifference/*: Array<T> */ = [],
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
    if (r1.done) {
      break;
    }
    if (r2.done) {
      arrayDifference.push(r1.value);
      r1 = null;
    } else {
      const order = cmp(r1.value, r2.value);
      if (order < 0) {
        arrayDifference.push(r1.value);
        r1 = null;
      } else if (order > 0) {
        r2 = null;
      } else {
        r1 = null;
        r2 = null;
      }
    }
  }

  return fromDistinctAscArray(arrayDifference);
}
