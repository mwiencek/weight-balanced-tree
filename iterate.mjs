// @flow strict

import type {ImmutableTree} from './types';

export default function* iterate<T>(
  tree: ImmutableTree<T> | null,
): Generator<T, void, void> {
  const stack = [];
  let cursor = tree;
  do {
    while (cursor !== null) {
      stack.push(cursor);
      cursor = cursor.left;
    }
    if (stack.length) {
      cursor = stack.pop();
      yield cursor.value;
      /*:: invariant(cursor); */
      cursor = cursor.right;
    }
  } while (stack.length || cursor !== null);
}
