// @flow strict

import type {ImmutableTreeT} from './types';

export default function minNode<T>(
  tree: ImmutableTreeT<T>,
): ImmutableTreeT<T> {
  let node = tree;
  while (node.left !== null) {
    node = node.left;
  }
  return node;
}
