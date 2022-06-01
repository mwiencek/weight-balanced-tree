// @flow strict

/*::
import type {ImmutableTree, SomeTreeAction, TreeAction} from './types.mjs';
*/

export const NOOP/*: SomeTreeAction */ =
  /*:: <T> */(tree/*: ImmutableTree<T> */)/*: ImmutableTree<T> */ => tree;

export const REPLACE/*: SomeTreeAction */ =
  /*:: <T> */(tree/*: ImmutableTree<T> */, value/*: T */)/*: ImmutableTree<T> */ => ({
    left: tree.left,
    right: tree.right,
    size: tree.size,
    value,
  });

export const THROW/*: SomeTreeAction */ = () => {
  throw new Error('');
};

export function replaceWith/*:: <T> */(
  getValue/*: (oldValue: T, newValue: T) => T */,
)/*: TreeAction<T> */ {
  return function (tree/*: ImmutableTree<T> */, newValue/*: T */)/*: ImmutableTree<T> */ {
    return {
      left: tree.left,
      right: tree.right,
      size: tree.size,
      value: getValue(tree.value, newValue),
    };
  };
}
