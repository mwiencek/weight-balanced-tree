// @flow strict

import type {ImmutableTree, SomeTreeAction} from './types';

export const NOOP: SomeTreeAction =
  <T>(tree: ImmutableTree<T>): ImmutableTree<T> => tree;

export const REPLACE: SomeTreeAction =
  <T>(tree: ImmutableTree<T>, value: T): ImmutableTree<T> => ({
    value,
    size: tree.size,
    left: tree.left,
    right: tree.right,
  });

export const THROW: SomeTreeAction = () => {
  throw new Error('');
};
