// @flow strict

/*::
import type {ImmutableTree} from '../src/types.js';
*/

function replaceEmptyNodes(key/*: string */, value/*: mixed */) {
  if (
    (key === 'left' || key === 'right') &&
    typeof value === 'object' &&
    value !== null &&
    value.size === 0
  ) {
    return null;
  }
  return value;
}

export default function treeToString(
  tree/*: ImmutableTree<mixed> */,
)/*: string */ {
  return JSON.stringify(tree, replaceEmptyNodes, 2);
}
