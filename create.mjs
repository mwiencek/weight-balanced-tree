// @flow strict

/*::
import type {ImmutableTree} from './types.mjs';
*/

export default function create/*:: <T> */(
  value/*: T */,
)/*: ImmutableTree<T> */ {
  return {
    left: null,
    right: null,
    size: 1,
    value,
  };
}
