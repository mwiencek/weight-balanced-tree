// @flow strict

import empty from './empty.js';
import {ValueNotFoundError} from './errors.js';
import join from './join.js';
import join2 from './join2.js';
/*::
import type {ImmutableTree, MutableTree} from './types.js';
*/

export default function remove/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
)/*: ImmutableTree<T> */ {
  if (tree.size === 0) {
    return empty;
  }
  const order = cmp(value, tree.value);
  if (order < 0) {
    const newLeft = remove(tree.left, value, cmp);
    if (newLeft !== tree.left) {
      return join(newLeft, tree.value, tree.right);
    }
    return tree;
  } else if (order > 0) {
    const newRight = remove(tree.right, value, cmp);
    if (newRight !== tree.right) {
      return join(tree.left, tree.value, newRight);
    }
    return tree;
  }
  return join2(tree.left, tree.right);
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
