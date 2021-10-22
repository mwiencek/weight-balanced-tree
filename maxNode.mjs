// @flow strict

import type {ImmutableTreeT} from './types';

export default function maxNode<T>(
  tree: ImmutableTreeT<T>,
): ImmutableTreeT<T> {
  let node = tree;
  while (node.right !== null) {
    node = node.right;
  }
  return node;
}
