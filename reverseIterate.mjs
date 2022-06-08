// @flow strict

/*::
import type {ImmutableTree} from './types.mjs';
import invariant from './invariant.mjs';
*/

export default function* reverseIterate/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
)/*: Generator<T, void, void> */ {
  const stack = [];
  let cursor = tree;
  do {
    while (cursor !== null) {
      stack.push(cursor);
      cursor = cursor.right;
    }
    if (stack.length) {
      cursor = stack.pop();
      yield cursor.value;
      /*:: invariant(cursor); */
      cursor = cursor.left;
    }
  } while (stack.length || cursor !== null);
}
