// @flow strict

/*::
import type {ImmutableTree} from './types.js';
*/

export default function* findAll/*:: <T, K = T> */(
  tree/*: ImmutableTree<T> */,
  key/*: K */,
  cmp/*: (a: K, b: T) => number */,
)/*: Generator<T, void, void> */ {
  if (tree.size === 0) {
    return;
  }
  const order = cmp(key, tree.value);
  if (order <= 0) {
    yield* findAll(tree.left, key, cmp);
  }
  if (order === 0) {
    yield tree.value;
  }
  if (order >= 0) {
    yield* findAll(tree.right, key, cmp);
  }
}
