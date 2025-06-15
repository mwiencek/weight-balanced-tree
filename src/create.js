// @flow strict

import empty from './empty.js';
/*::
import type {
  ImmutableTree,
  MutableTree,
  NonEmptyImmutableTree,
} from './types.js';
*/

export function node/*:: <T> */(
  left/*: ImmutableTree<T> */,
  value/*: T */,
  right/*: ImmutableTree<T> */,
)/*: MutableTree<T> */ {
  return {
    left,
    right,
    size: left.size + right.size + 1,
    value,
  };
}

export default function create/*:: <T> */(
  value/*: T */,
)/*: NonEmptyImmutableTree<T> */ {
  return node(empty, value, empty);
}
