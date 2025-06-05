// @flow strict

/*::
import type {ImmutableTree} from './types.js';
import invariant from './invariant.js';
*/

export default function* iterate/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
)/*: Generator<T, void, void> */ {
  const stack = [];
  let cursor/*: ?ImmutableTree<T> */ = tree;
  do {
    while (cursor != null) {
      stack.push(cursor);
      cursor = cursor.left;
    }
    cursor = stack.pop();
    if (cursor) {
      yield cursor.value;
      /*:: invariant(cursor != null); */
      cursor = cursor.right;
    }
  } while (stack.length || cursor != null);
}
