// @flow strict

import iterate from './iterate.js';
/*::
import invariant from './invariant.js';
import type {ImmutableTree} from './types.js';
*/

export default function equals/*:: <T, U = T> */(
  a/*: ImmutableTree<T> */,
  b/*: ImmutableTree<U> */,
  // `Object.is` is a static method, so Flow shouldn't care about unbinding.
  // $FlowIssue[method-unbinding]
  isEqual/*:: ?: (a: T, b: U) => boolean */ = Object.is,
)/*: boolean */ {
  if (a.size === 0 && b.size === 0) {
    return true;
  }
  if (a.size === 0 || b.size === 0) {
    return false;
  }
  if (a.size !== b.size) {
    return false;
  }
  const aIter = iterate(a);
  const bIter = iterate(b);
  while (true) {
    const aNext = aIter.next();
    const bNext = bIter.next();
    if (aNext.done || bNext.done) {
      break;
    } else if (!isEqual(aNext.value, bNext.value)) {
      return false;
    }
  }
  return true;
}
