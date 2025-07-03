// @flow strict

/*::
import type {ImmutableTree, Stack} from './types.js';
import invariant from './invariant.js';
*/

export default function* reverseIterate/*:: <T> */(
  tree/*: ImmutableTree<T> */,
)/*: Generator<T, void, void> */ {
  let stack/*: Stack<T> | null */ = null;
  let cursor/*: ImmutableTree<T> */ = tree;
  do {
    while (cursor.size !== 0) {
      stack = {node: cursor, next: stack};
      cursor = cursor.right;
    }
    if (stack !== null) {
      const node = stack.node;
      yield node.value;
      /*:: invariant(node != null && stack != null); */
      cursor = node.left;
      stack = stack.next;
    }
  } while (stack !== null || cursor.size !== 0);
}
