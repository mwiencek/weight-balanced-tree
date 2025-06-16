// @flow strict

import empty from './empty.js';
import {ValueNotFoundError} from './errors.js';
import update, {
  onConflictRemoveValue,
  onNotFoundDoNothing,
} from './update.js';
/*::
import type {ImmutableTree, MutableTree} from './types.js';
*/

export default function remove/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
)/*: ImmutableTree<T> */ {
  return update(
    tree,
    value,
    cmp,
    onConflictRemoveValue,
    onNotFoundDoNothing,
  );
}

export const removeIfExists/*: <T> (
  tree: ImmutableTree<T>,
  value: T,
  cmp: (a: T, b: T) => number,
) => ImmutableTree<T> */ = remove;

export function removeOrThrowIfNotExists/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
)/*: ImmutableTree<T> */ {
  const newTree = remove(tree, value, cmp);
  if (newTree === tree) {
    throw new ValueNotFoundError(value);
  }
  return newTree;
}
