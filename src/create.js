// @flow strict

import empty from './empty.js';
/*::
import type {NonEmptyImmutableTree} from './types.js';
*/

export default function create/*:: <T> */(
  value/*: T */,
)/*: NonEmptyImmutableTree<T> */ {
  return {
    left: empty,
    right: empty,
    size: 1,
    value,
  };
}
