// @flow strict

import find from './find.mjs';
import iterate from './iterate.mjs';
/*::
import type {ImmutableTree} from './types.mjs';
*/

export default function equals/*:: <T> */(
  a/*: ImmutableTree<T> | null */,
  b/*: ImmutableTree<T> | null */,
  cmp/*: (a: T, b: T) => number */,
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
  for (const aValue of iterate(a)) {
    if (find(b, aValue, cmp) === null) {
      return false;
    }
  }
  return true;
}
