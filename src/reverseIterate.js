// @flow strict

/*::
import type {ImmutableTree, Stack} from './types.js';
import invariant from './invariant.js';
*/
import getSliceArgs from './utility/getSliceArgs.js';

export default function* reverseIterate/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  start/*:: ?: number */ = 0,
  end/*:: ?: number */ = tree.size,
)/*: Generator<T, void, void> */ {
  const {actualStart, actualEnd} = getSliceArgs(tree, start, end);
  if (actualStart >= actualEnd) {
    return;
  }

  let stack/*: Stack<T> | null */ = null;
  let cursor/*: ImmutableTree<T>*/ = tree;
  let index = actualEnd - 1;

  while (cursor.size !== 0) {
    const leftSize = cursor.left.size;
    if (index < leftSize) {
      cursor = cursor.left;
    } else if (index === leftSize) {
      break;
    } else {
      index -= (leftSize + 1);
      stack = {node: cursor, next: stack};
      cursor = cursor.right;
    }
  }

  for (index = actualEnd - 1; index >= actualStart; index--) {
    /*:: invariant(cursor.size !== 0); */
    yield cursor.value;
    /*:: invariant(cursor.size !== 0); */
    cursor = cursor.left;
    while (cursor.size !== 0) {
      stack = {node: cursor, next: stack};
      cursor = cursor.right;
    }
    if (stack === null) {
      break;
    }
    cursor = stack.node;
    stack = stack.next;
  }
}
