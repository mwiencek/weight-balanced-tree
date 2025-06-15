import getSortedIndex from './getSortedIndex.js';

function getInArray(array, index) {
  return array[index];
}

export function getSortedArrayIndex(array, size, value, cmp) {
  return getSortedIndex(array, size, value, getInArray, cmp);
}

export function sortedArrayFindOrInsert(
  array,
  value,
  cmp,
  copy = false
) {
  const [index, exists] = getSortedArrayIndex(
    array,
    array.length,
    value,
    cmp,
  );
  if (!exists) {
    if (copy) {
      array = array.slice(0);
    }
    array.splice(index, 0, value);
  }
  return array;
}

export function sortedArrayRemove(
  array,
  value,
  cmp,
  copy = false
) {
  const [index, exists] = getSortedArrayIndex(
    array,
    array.length,
    value,
    cmp,
  );
  if (exists) {
    if (copy) {
      array = array.slice(0);
    }
    array.splice(index, 1);
  }
  return array;
}
