// @flow strict

import type {ImmutableTree} from './types';

export default function minNode<T>(
  tree: ImmutableTree<T>,
): ImmutableTree<T> {
  let node = tree;
  while (node.left !== null) {
    node = node.left;
  }
  return node;
}
