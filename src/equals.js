// @flow strict

import iterate from './iterate.js';
import zip from './zip.js';
/*::
import invariant from './invariant.js';
import type {ImmutableTree} from './types.js';
*/

export default function equals/*:: <T> */(
  a/*: ImmutableTree<T> | null */,
  b/*: ImmutableTree<T> | null */,
  // `Object.is` is a static method, so Flow shouldn't care about unbinding.
  // $FlowIssue[method-unbinding]
  isEqual/*:: ?: (a: T, b: T) => boolean */ = Object.is,
)/*: boolean */ {
  if (a === null && b === null) {
    return true;
  }
  if (a === null || b === null) {
    return false;
  }
  if (a.size !== b.size) {
    return false;
  }
  for (
    const [aValue, bValue] of
    /*
     * `zip` yields `[T | void, U | void]` due to the possibility of
     * `a` and `b` having different sizes, but we've excluded that
     * case above.
     */
    // $FlowIgnore[incompatible-cast]
    zip(a, b) /*:: as Generator<[T, T], void, void> */
  ) {
    if (!isEqual(aValue, bValue)) {
      return false;
    }
  }
  return true;
}
