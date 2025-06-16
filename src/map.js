// @flow strict

import {node} from './create.js';
import empty from './empty.js';
/*::
import type {ImmutableTree} from './types.js';
*/

export default function map/*:: <T, U> */(
  tree/*: ImmutableTree<T> */,
  mapper/*: (value: T) => U */,
)/*: ImmutableTree<U> */ {
  if (tree.size === 0) {
    return empty;
  }
  return node(
    map(tree.left, mapper),
    mapper(tree.value),
    map(tree.right, mapper),
  );
}
