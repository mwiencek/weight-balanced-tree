// @flow strict

import iterate from './iterate.js';
/*::
import invariant from './invariant.js';
import type {ImmutableTree} from './types.js';
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
