// @flow strict

/*::
import type {ImmutableTree, SomeTreeAction, TreeAction} from './types.mjs';
*/

export const NOOP/*: SomeTreeAction */ =
  /*:: <T> */(tree/*: ImmutableTree<T> */)/*: ImmutableTree<T> */ => tree;

export const REPLACE/*: SomeTreeAction */ =
  /*:: <T> */(tree/*: ImmutableTree<T> */, value/*: T */)/*: ImmutableTree<T> */ => ({
    value,
    size: tree.size,
    left: tree.left,
    right: tree.right,
  });

export const THROW/*: SomeTreeAction */ = () => {
  throw new Error('');
};

export function replaceWith/*:: <T> */(
  getValue/*: (oldValue: T, newValue: T) => T */,
)/*: TreeAction<T> */ {
  return function (tree/*: ImmutableTree<T> */, newValue/*: T */)/*: ImmutableTree<T> */ {
    return {
      value: getValue(tree.value, newValue),
      size: tree.size,
      left: tree.left,
      right: tree.right,
    };
  };
}
