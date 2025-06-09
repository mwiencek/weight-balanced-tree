export default function getSortedIndex(array, size, value, get, cmp) {
  let low = 0;
  let high = size;
  let middle;
  let order;
  while (low < high) {
    middle = Math.floor((low + high) / 2);
    order = cmp(get(array, middle), value);
    if (order < 0) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }
  if (middle !== undefined && high !== middle && high < size) {
    order = cmp(get(array, high), value);
  }
  return [high, order === 0];
}
