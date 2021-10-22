// @flow strict

import minNode from './minNode.mjs';
import type {ImmutableTreeT} from './types';

export default function minValue<T>(
  tree: ImmutableTreeT<T>,
): T {
  return minNode(tree).value;
}
