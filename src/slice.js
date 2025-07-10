// @flow strict

import empty from './empty.js';
import splitIndex from './splitIndex.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export default function slice/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  start/*:: ?: number */,
  end/*:: ?: number */
)/*: ImmutableTree<T> */ {
  const size = tree.size;
  let actualStart = Math.trunc(+start);
  let actualEnd = end === undefined ? size : Math.trunc(+end);

  if (Number.isNaN(actualStart)) {
    actualStart = 0;
  }
  if (Number.isNaN(actualEnd)) {
    actualEnd = 0;
  }

  actualStart = actualStart < 0
    ? Math.max(size + actualStart, 0)
    : Math.min(actualStart, size);
  actualEnd = actualEnd < 0
    ? Math.max(size + actualEnd, 0)
    : Math.min(actualEnd, size);

  if (actualStart >= actualEnd) {
    return empty;
  }

  const [/* small */, /* equal */, large] = splitIndex(tree, actualStart - 0.5);
  const [result] = splitIndex(large, actualEnd - actualStart - 0.5);
  return result;
}
