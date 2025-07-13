// @flow strict

import join2 from './join2.js';
import splitIndex from './splitIndex.js';
/*::
import type {ImmutableTree} from './types.js';

export type SpliceResult<T> = {
  +tree: ImmutableTree<T>,
  +deleted: ImmutableTree<T>,
};
*/

export default function splice/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  start/*: number */,
  deleteCount/*: number */,
  items/*: ImmutableTree<T> */
)/*: SpliceResult<T> */ {
  let adjustedStart = Math.trunc(+start);
  if (Number.isNaN(adjustedStart)) {
    adjustedStart = 0;
  }
  adjustedStart = adjustedStart < 0
    ? Math.max(tree.size + adjustedStart, 0)
    : adjustedStart;
  let adjustedDeleteCount = Math.trunc(+deleteCount);
  if (Number.isNaN(adjustedDeleteCount)) {
    adjustedDeleteCount = 0;
  }
  const [head, /* empty */, rest] = splitIndex(tree, adjustedStart - 0.5);
  const [deleted, /* empty */, tail] = splitIndex(rest, adjustedDeleteCount - 0.5);
  return {tree: join2(join2(head, items), tail), deleted};
}
