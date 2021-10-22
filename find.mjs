// @flow strict

import type {ImmutableTree} from './types';

export default function find<T, V = T>(
  tree: ImmutableTree<T> | null,
  value: V,
  cmp: (V, T) => number,
): ImmutableTree<T> | null {
  let cursor = tree;
  while (cursor !== null) {
    const order = cmp(value, cursor.value);
    if (order === 0) {
      break;
    } else if (order < 0) {
      cursor = cursor.left;
    } else {
      cursor = cursor.right;
    }
  }
  return cursor;
}
