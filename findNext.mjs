// @flow strict

import minNode from './minNode.mjs';
import type {ImmutableTreeT} from './types';

export default function findNext<T, V = T>(
  tree: ImmutableTreeT<T> | null,
  value: V,
  cmp: (V, T) => number,
): ImmutableTreeT<T> | null {
  let cursor = tree;
  let largerParent = null;
  while (cursor !== null) {
    const order = cmp(value, cursor.value);
    if (order === 0) {
      break;
    } else if (order < 0) {
      largerParent = cursor;
      cursor = cursor.left;
    } else {
      cursor = cursor.right;
    }
  }
  if (cursor !== null && cursor.right !== null) {
    return minNode(cursor.right);
  }
  return largerParent;
}
