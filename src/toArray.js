// @flow strict

import iterate from './iterate.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export default function toArray/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
)/*: Array<T> */ {
  return Array.from(iterate(tree));
}
