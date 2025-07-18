// @flow strict

/*::
import type {ImmutableTree} from '../types.js';
*/

export default function safeSize(tree/*: ImmutableTree<mixed> | null */)/*: number */ {
  return tree === null ? 0 : tree.size;
}
