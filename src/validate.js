// @flow strict

/*::
import type {ImmutableTree} from './types.js';

export type ValidateResult<+T> =
  | {+valid: true}
  | {
      +valid: false,
      +tree: ImmutableTree<T>,
      +subtree: 'left' | 'right',
    };
*/

export default function validate/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
  cmp/*: (T, T) => number */,
)/*: ValidateResult<T> */ {
  if (tree === null) {
    return {valid: true};
  }

  const left = tree.left;
  if (left) {
    if (cmp(left.value, tree.value) >= 0) {
      return {valid: false, tree, subtree: 'left'};
    }
    validate(left, cmp);
  }

  const right = tree.right;
  if (right) {
    if (cmp(right.value, tree.value) <= 0) {
      return {valid: false, tree, subtree: 'right'};
    }
    validate(right, cmp);
  }

  return {valid: true};
}
