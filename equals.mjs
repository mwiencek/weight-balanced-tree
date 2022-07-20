// @flow strict

import iterate from './iterate.mjs';
import zip from './zip.mjs';
/*::
import invariant from './invariant.mjs';
import type {ImmutableTree} from './types.mjs';
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
  for (const [aValue, bValue] of zip(a, b)) {
    /*::
    // These may actually be void if T includes void, but it's to convince
    // Flow that they're not void from zip.
    invariant(aValue !== undefined && bValue !== undefined);
    */
    if (!isEqual(aValue, bValue)) {
      return false;
    }
  }
  return true;
}
