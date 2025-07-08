// @flow strict

import {
  balanceLeft,
  balanceRight,
  heavy,
} from './balance.js';
import {node} from './create.js';
/*::
import invariant from './invariant.js';
import type {ImmutableTree, NonEmptyImmutableTree} from './types.js';
*/

export default function join/*:: <T> */(
  left/*: ImmutableTree<T> */,
  value/*: T */,
  right/*: ImmutableTree<T> */,
)/*: NonEmptyImmutableTree<T> */ {
  if ((left.size + right.size) >= 2) {
    if (heavy(left.size, right.size)) {
      /*:: invariant(left.size !== 0); */
      return balanceRight(node(
        left.left,
        left.value,
        join(left.right, value, right),
      ));
    }
    if (heavy(right.size, left.size)) {
      /*:: invariant(right.size !== 0); */
      return balanceLeft(node(
        join(left, value, right.left),
        right.value,
        right.right,
      ));
    }
  }
  return node(left, value, right);
}
