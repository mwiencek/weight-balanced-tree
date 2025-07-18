// @flow strict

/*::
import type {ImmutableTree, Stack} from './types.js';
import invariant from './invariant.js';
*/
import getSliceArgs from './utility/getSliceArgs.js';

export default function* iterate/*::<T>*/(
  tree/*: ImmutableTree<T>*/,
  start/*:: ?: number */ = 0,
  end/*:: ?: number */ = tree.size,
)/*: Generator<T, void, void>*/ {
  const {actualStart, actualEnd} = getSliceArgs(tree, start, end);
  if (actualStart >= actualEnd) {
    return;
  }

  let stack/*: Stack<T> | null */ = null;
  let cursor/*: ImmutableTree<T>*/ = tree;
  let index = actualStart;

  while (cursor.size !== 0) {
    const leftSize = cursor.left.size;
    if (index < leftSize) {
      stack = {node: cursor, next: stack};
      cursor = cursor.left;
    } else if (index === leftSize) {
      break;
    } else {
      index -= (leftSize + 1);
      cursor = cursor.right;
    }
  }

  for (index = actualStart; index < actualEnd; index++) {
    /*:: invariant(cursor.size !== 0); */
    yield cursor.value;
    /*:: invariant(cursor.size !== 0); */
    cursor = cursor.right;
    while (cursor.size !== 0) {
      stack = {node: cursor, next: stack};
      cursor = cursor.left;
    }
    if (stack === null) {
      break;
    }
    cursor = stack.node;
    stack = stack.next;
  }
}
