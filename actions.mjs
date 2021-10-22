// @flow strict

import type {ImmutableTreeT, SomeTreeActionT} from './types';

export const NOOP: SomeTreeActionT =
  <T>(tree: ImmutableTreeT<T>): ImmutableTreeT<T> => tree;

export const REPLACE: SomeTreeActionT =
  <T>(tree: ImmutableTreeT<T>, value: T): ImmutableTreeT<T> => ({
    value,
    size: tree.size,
    left: tree.left,
    right: tree.right,
  });

export const THROW: SomeTreeActionT = () => {
  throw new Error('');
};
