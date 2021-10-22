// @flow strict

import type {ImmutableTree} from './types';

export default function maxNode<T>(
  tree: ImmutableTree<T>,
): ImmutableTree<T> {
  let node = tree;
  while (node.right !== null) {
    node = node.right;
  }
  return node;
}
