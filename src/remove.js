// @flow strict

import {ValueNotFoundError} from './errors.js';
import update, {
  onConflictRemoveValue,
  onNotFoundDoNothing,
} from './update.js';
/*::
import type {ImmutableTree, MutableTree} from './types.js';
*/

export default function remove/*:: <T, K> */(
  tree/*: ImmutableTree<T> */,
  key/*: K */,
  cmp/*: (key: K, treeValue: T) => number */,
)/*: ImmutableTree<T> */ {
  return update(
    tree,
    key,
    cmp,
    onConflictRemoveValue,
    onNotFoundDoNothing,
  );
}

export const removeIfExists/*: <T, K> (
  tree: ImmutableTree<T>,
  key: K,
  cmp: (key: K, treeValue: T) => number,
) => ImmutableTree<T> */ = remove;

export function removeOrThrowIfNotExists/*:: <T, K> */(
  tree/*: ImmutableTree<T> */,
  key/*: K */,
  cmp/*: (key: K, treeValue: T) => number */,
)/*: ImmutableTree<T> */ {
  const newTree = remove(tree, key, cmp);
  if (newTree === tree) {
    throw new ValueNotFoundError(key);
  }
  return newTree;
}
