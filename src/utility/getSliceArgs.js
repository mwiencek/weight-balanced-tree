// @flow strict

/*::
import type {ImmutableTree} from '../types.js';
*/

export default function getSliceArgs(
  tree/*: ImmutableTree<mixed> */,
  start/*: number | void */,
  end/*: number | void */,
)/*: {+actualStart: number, +actualEnd: number} */ {
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
  return {actualStart, actualEnd};
}
