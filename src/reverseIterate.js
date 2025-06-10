// @flow strict

/*::
import type {ImmutableTree} from './types.js';
import invariant from './invariant.js';
*/

export default function* reverseIterate/*:: <T> */(
  tree/*: ImmutableTree<T> */,
)/*: Generator<T, void, void> */ {
  const stack = [];
  let cursor/*: ImmutableTree<T> */ = tree;
  do {
    while (cursor.size !== 0) {
      stack.push(cursor);
      cursor = cursor.right;
    }
    const next = stack.pop();
    if (next) {
      yield next.value;
      /*:: invariant(next != null); */
      cursor = next.left;
    }
  } while (stack.length || cursor.size !== 0);
}
