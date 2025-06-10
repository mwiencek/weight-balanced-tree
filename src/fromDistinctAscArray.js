// @flow strict

import empty from './empty.js';
/*::
import type {ImmutableTree} from './types.js';
*/

function _fromDistinctAscArray/*:: <T> */(
  array/*: $ReadOnlyArray<T> */,
  start/*: number */,
  end/*: number */,
)/*: ImmutableTree<T> */ {
  if (start > end) {
    return empty;
  }
  const middle = start + Math.floor((end - start) / 2);
  const left = _fromDistinctAscArray(array, start, middle - 1);
  const right = _fromDistinctAscArray(array, middle + 1, end);
  return {
    left,
    right,
    size: left.size + right.size + 1,
    value: array[middle],
  };
}

export default function fromDistinctAscArray/*:: <T> */(
  array/*: $ReadOnlyArray<T> */,
)/*: ImmutableTree<T> */ {
  return _fromDistinctAscArray(array, 0, array.length - 1);
}
