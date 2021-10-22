// @flow strict

import maxNode from './maxNode.mjs';
import type {ImmutableTreeT} from './types';

export default function maxValue<T>(
  tree: ImmutableTreeT<T>,
): T {
  return maxNode(tree).value;
}
