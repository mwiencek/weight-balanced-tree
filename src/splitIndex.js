// @flow strict

import {
  /*:: type SplitResult, */
  _splitInternal,
} from './split.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export default function splitIndex/*:: <T, K = T> */(
  tree/*: ImmutableTree<T> */,
  index/*: number */,
)/*: SplitResult<T> */ {
  return _splitInternal(
    tree,
    index,
    (index, value, nodeIndex) => index - nodeIndex,
    tree.left === null ? 0 : tree.left.size,
  );
}
