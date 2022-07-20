// @flow strict

import iterate from './iterate.mjs';
/*::
import invariant from './invariant.mjs';
import type {ImmutableTree} from './types.mjs';
*/

export default function* zip/*:: <T, U> */(
  t1/*: ImmutableTree<T> | null */,
  t2/*: ImmutableTree<U> | null */,
)/*: Generator<[T | void, U | void], void, void> */ {
  const iter1 = iterate(t1);
  const iter2 = iterate(t2);

  while (true) {
    const v1 = iter1.next();
    const v2 = iter2.next();

    if (v1.done && v2.done) {
      return;
    }

    yield [v1.value, v2.value];
  }
}

/*
 * Internal-only.  This version shouldn't be called without first
 * checking that both trees are the same size.  The result is that
 * `[T | void, U | void]` becomes just `[T, U]`.
 */
export function* zipSameSize/*:: <T, U> */(
  t1/*: ImmutableTree<T> | null */,
  t2/*: ImmutableTree<U> | null */,
)/*: Generator<[T, U], void, void> */ {
  /*:: invariant(t1?.size === t2?.size); */

  const iter1 = iterate(t1);
  const iter2 = iterate(t2);

  while (true) {
    const v1 = iter1.next();
    const v2 = iter2.next();

    /*:: invariant(v1.done === v2.done); */
    if (v1.done || v2.done) {
      return;
    }

    yield [v1.value, v2.value];
  }
}
