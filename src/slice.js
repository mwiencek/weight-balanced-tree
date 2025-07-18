// @flow strict

import empty from './empty.js';
import splitIndex from './splitIndex.js';
import getSliceArgs from './utility/getSliceArgs.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export default function slice/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  start/*:: ?: number */,
  end/*:: ?: number */
)/*: ImmutableTree<T> */ {
  const {actualStart, actualEnd} = getSliceArgs(tree, start, end);
  if (actualStart >= actualEnd) {
    return empty;
  }

  const [/* small */, /* equal */, large] = splitIndex(tree, actualStart - 0.5);
  const [result] = splitIndex(large, actualEnd - actualStart - 0.5);
  return result;
}
