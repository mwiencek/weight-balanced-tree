import Benchmark from 'benchmark';
import * as Immutable from 'immutable';

import * as wbt from './index.mjs';

const suite = new Benchmark.Suite();

const asciiTable = [];
for (let i = 0; i < 128; i++) {
  asciiTable.push(['ascii-' + String(i), String.fromCharCode(i)]);
}

const compareKeys = (a, b) => {
  const ai = parseInt(a[0].slice(6), 10);
  const bi = parseInt(b[0].slice(6), 10);
  return ai < bi ? -1 : (ai > bi ? 1 : 0);
};

function getSortedIndex(array, size, value, get, cmp) {
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

function getInArray(array, index) {
  return array[index];
}

function sortedFindOrInsertArray(array, value, cmp) {
  const [index, exists] = getSortedIndex(
    array,
    array.length,
    value,
    getInArray,
    cmp,
  );
  if (exists) {
    return array;
  }
  const copy = array.slice(0);
  copy.splice(index, 0, value);
  return copy;
}

function getInImmutableList(array, index) {
  return array.get(index);
}

function sortedFindOrInsertImmutableList(list, value, cmp) {
  const [index, exists] = getSortedIndex(
    list,
    list.size,
    value,
    getInImmutableList,
    cmp,
  );
  if (exists) {
    return list;
  }
  return list.insert(index, value);
}

let prefilledTree = null;
for (const pair of asciiTable) {
  prefilledTree = wbt.insert(prefilledTree, pair, compareKeys);
}

const prefilledImmutableList = Immutable.List(asciiTable);

suite.add('insertion (weight-balanced-tree)', function () {
  let tree = null;
  for (const pair of asciiTable) {
    tree = wbt.insert(tree, pair, compareKeys);
  }
});

suite.add('insertion (Immutable.List)', function () {
  let list = Immutable.List();
  for (const pair of asciiTable) {
    list = sortedFindOrInsertImmutableList(list, pair, compareKeys);
  }
});

suite.add('insertion (array)', function () {
  let array = [];
  for (const pair of asciiTable) {
    array = sortedFindOrInsertArray(array, pair, compareKeys);
  }
});

suite.add('removal (weight-balanced-tree)', function () {
  let tree = prefilledTree;
  for (const pair of asciiTable) {
    tree = wbt.remove(tree, pair, compareKeys);
  }
});

suite.add('removal (Immutable.List)', function () {
  let list = prefilledImmutableList;
  for (const pair of asciiTable) {
    const [index, exists] = getSortedIndex(
      list,
      list.size,
      pair,
      getInImmutableList,
      compareKeys,
    );
    if (exists) {
      list = list.delete(index);
    }
  }
});

suite.add('removal (array)', function () {
  let array = asciiTable;
  for (const pair of asciiTable) {
    const [index, exists] = getSortedIndex(
      array,
      array.length,
      pair,
      getInArray,
      compareKeys,
    );
    if (exists) {
      array = array.slice(0);
      array.splice(index, 1);
    }
  }
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
});

suite.run({async: true});
