// @flow strict

/*::
import type {ImmutableTree} from './types.mjs';
import invariant from './invariant.mjs';
*/

export default function* reverseIterate/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
)/*: Generator<T, void, void> */ {
  const stack = [];
  let cursor/*: ?ImmutableTree<T> */ = tree;
  do {
    while (cursor != null) {
      stack.push(cursor);
      cursor = cursor.right;
    }
    cursor = stack.pop();
    if (cursor) {
      yield cursor.value;
      /*:: invariant(cursor != null); */
      cursor = cursor.left;
    }
  } while (stack.length || cursor != null);
}
