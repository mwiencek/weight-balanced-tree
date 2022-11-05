// @flow strict

/*::
import type {ImmutableTree} from './types.mjs';
*/

function _fromDistinctAscArray/*:: <T> */(
  array/*: $ReadOnlyArray<T> */,
  start/*: number */,
  end/*: number */,
)/*: ImmutableTree<T> | null */ {
  if (start > end) {
    return null;
  }
  const middle = start + Math.floor((end - start) / 2);
  const left = _fromDistinctAscArray(array, start, middle - 1);
  const right = _fromDistinctAscArray(array, middle + 1, end);
  const leftSize = left === null ? 0 : left.size;
  const rightSize = right === null ? 0 : right.size;
  return {
    left,
    right,
    size: leftSize + rightSize + 1,
    value: array[middle],
  };
}

export default function fromDistinctAscArray/*:: <T> */(
  array/*: $ReadOnlyArray<T> */,
)/*: ImmutableTree<T> | null */ {
  return _fromDistinctAscArray(array, 0, array.length - 1);
}
