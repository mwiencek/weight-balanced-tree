import Benchmark from 'benchmark';
import * as Immutable from 'immutable';

import * as wbt from './build/index.mjs';

const suite = new Benchmark.Suite();

const asciiTable = [];
for (let i = 0; i < 128; i++) {
  asciiTable.push(['ascii-' + String(i), String.fromCharCode(i)]);
}

const compareKeys = (a, b) => a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0);

let prefilledTree = null;
for (const pair of asciiTable) {
  prefilledTree = wbt.insert(prefilledTree, pair, compareKeys);
}

const prefilledImmutableMap = Immutable.Map(asciiTable);

const prefilledPlainObject = Object.fromEntries(asciiTable);

suite.add('insertion (wbt-flow)', function () {
  let tree = null;
  for (const pair of asciiTable) {
    tree = wbt.insert(tree, pair, compareKeys);
  }
});

suite.add('insertion (immutable-js)', function () {
  let map = Immutable.Map();
  for (const pair of asciiTable) {
    map = map.set(pair[0], pair[1]);
  }
});

suite.add('insertion (plain object)', function () {
  let object = {};
  for (const pair of asciiTable) {
    object = {...object};
    object[pair[0]] = pair[1];
  }
});

suite.add('find/get (wbt-flow)', function () {
  for (const pair of asciiTable) {
    wbt.find(prefilledTree, pair, compareKeys);
  }
});

suite.add('find/get (immutable-js)', function () {
  for (const pair of asciiTable) {
    prefilledImmutableMap.get(pair[0]);
  }
});

suite.add('find/get (plain object)', function () {
  for (const pair of asciiTable) {
    prefilledPlainObject[pair[0]];
  }
});

suite.add('find/get (array find)', function () {
  for (const pair of asciiTable) {
    asciiTable.find((a) => compareKeys(a, pair) === 0);
  }
});

suite.add('removal (wbt-flow)', function () {
  let tree = prefilledTree;
  for (const pair of asciiTable) {
    tree = wbt.remove(tree, pair, compareKeys);
  }
});

suite.add('removal (immutable-js)', function () {
  let map = prefilledImmutableMap;
  for (const pair of asciiTable) {
    map = map.delete(pair[0]);
  }
});

suite.add('removal (plain object)', function () {
  let object = prefilledPlainObject;
  for (const pair of asciiTable) {
    object = {...object};
    delete object[pair[0]];
  }
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
});

suite.run({async: true});
