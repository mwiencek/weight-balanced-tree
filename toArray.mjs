// @flow strict

import iterate from './iterate.mjs';
/*::
import type {ImmutableTree} from './types.mjs';
*/

export default function toArray/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
)/*: $ReadOnlyArray<T> */ {
  return Array.from(iterate(tree));
}
