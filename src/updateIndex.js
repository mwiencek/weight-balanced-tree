// @flow strict

import {getAdjustedIndex} from './at.js';
import {_setIndexInternal} from './setIndex.js';
/*::
import invariant from './invariant.js';
import type {ImmutableTree} from './types.js';
*/

export default function updateIndex/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  index/*: number */,
  updater/*: (T) => T */,
)/*: ImmutableTree<T> */ {
  let adjustedIndex = getAdjustedIndex(tree, index);
  if (adjustedIndex === -1) {
    return tree;
  }
  /*:: invariant(tree.size !== 0); */
  return _setIndexInternal(tree, tree.left.size, {
    index: adjustedIndex,
    value: null,
    updater,
  });
}
