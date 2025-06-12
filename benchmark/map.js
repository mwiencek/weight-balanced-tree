import Benchmark from 'benchmark';
import * as Immutable from 'immutable';
import mori from 'mori';

import * as wbt from '../src/index.js';
import shuffle from '../test/shuffle.js';

const mapData = [];
for (let i = 0; i < 32768; i++) {
  mapData.push([
    /* key:   */ String.fromCharCode(i).repeat(7),
    /* value: */ i * 7,
  ])
}
shuffle(mapData);
const mapDataHalf1 = mapData.slice(0, mapData.length / 2);
const mapDataHalf2 = mapData.slice(mapData.length / 2, mapData.length);

const compareKeys = (a, b) => {
  return a === b ? 0 : (a < b ? -1 : 1);
};

const getKeyFromTuple = (keyValuePair) => {
  return keyValuePair[0];
};

const treeMap = wbt.withKeyComparator(
  compareKeys,
  getKeyFromTuple,
);

function buildWeightBalancedTree(data) {
  let map = wbt.empty;
  for (const keyValuePair of data) {
    map = treeMap.insert(map, keyValuePair);
  }
  return map;
}

function buildImmutableJsMap(data) {
  let map = Immutable.Map();
  for (const [key, value] of data) {
    map = map.set(key, value);
  }
  return map;
}

function buildMoriHashMap(data) {
  let map = mori.hashMap();
  for (const [key, value] of data) {
    map = mori.assoc.f3(map, key, value);
  }
  return map;
}

const mapDataCopy1 = mapData.slice(0);

const createSuite = new Benchmark.Suite('Map create')
  .add('weight-balanced-tree (fromDistinctAscArray)', function () {
    mapDataCopy1.sort(treeMap.cmp);
    wbt.fromDistinctAscArray(mapDataCopy1);
  })
  .add('Immutable.Map (constructor)', function () {
    new Immutable.Map(mapData);
  })
  .add('mori (hashMap)', function () {
    mori.hashMap(...mapData);
  });

const setSuite = new Benchmark.Suite('Map set')
  .add('weight-balanced-tree (insert)', function () {
    buildWeightBalancedTree(mapData);
  })
  .add('Immutable.Map (set)', function () {
    buildImmutableJsMap(mapData);
  })
  .add('mori (assoc)', function () {
    buildMoriHashMap(mapData);
  });

const weightBalancedTree = buildWeightBalancedTree(mapData);
const immutableJsMap = buildImmutableJsMap(mapData);
const moriHashMap = buildMoriHashMap(mapData);

const getSuite = new Benchmark.Suite('Map get')
  .add('weight-balanced-tree (findBy)', function () {
    for (const [key] of mapData) {
      treeMap.find(weightBalancedTree, key);
    }
  })
  .add('Immutable.Map (get)', function () {
    for (const [key] of mapData) {
      immutableJsMap.get(key);
    }
  })
  .add('mori (get)', function () {
    for (const [key] of mapData) {
      mori.get.f2(moriHashMap, key);
    }
  });

const removeSuite = new Benchmark.Suite('Map remove')
  .add('weight-balanced-tree (remove)', function () {
    let map = weightBalancedTree;
    for (const [key] of mapData) {
      map = wbt.remove(map, key, (treeValue) => compareKeys(key, treeValue[0]));
    }
  })
  .add('Immutable.Map (delete)', function () {
    let map = immutableJsMap;
    for (const [key] of mapData) {
      map = map.delete(key);
    }
  })
  .add('mori (dissoc)', function () {
    let map = moriHashMap;
    for (const [key] of mapData) {
      map = mori.dissoc.f2(map, key);
    }
  });

const weightBalancedTreeHalf1 = buildWeightBalancedTree(mapDataHalf1);
const weightBalancedTreeHalf2 = buildWeightBalancedTree(mapDataHalf2);
const immutableJsMapHalf1 = buildImmutableJsMap(mapDataHalf1);
const immutableJsMapHalf2 = buildImmutableJsMap(mapDataHalf2);
const moriHashMapHalf1 = buildMoriHashMap(mapDataHalf1);
const moriHashMapHalf2 = buildMoriHashMap(mapDataHalf2);

const mergeSuite = new Benchmark.Suite('Map merge')
  .add('weight-balanced-tree (union)', function () {
    treeMap.union(weightBalancedTreeHalf1, weightBalancedTreeHalf2);
  })
  .add('Immutable.Map (merge)', function () {
    immutableJsMapHalf1.merge(immutableJsMapHalf2);
  })
  .add('mori (merge)', function () {
    mori.merge(moriHashMapHalf1, moriHashMapHalf2);
  });

const weightBalancedTree2 = buildWeightBalancedTree(mapData);
const immutableJsMap2 = buildImmutableJsMap(mapData);
const moriHashMap2 = buildMoriHashMap(mapData);

const equalsSuite = new Benchmark.Suite('Map equals')
  .add('weight-balanced-tree (equals)', function () {
    wbt.equals(weightBalancedTree, weightBalancedTree2);
  })
  .add('Immutable.Map (equals)', function () {
    immutableJsMap.equals(immutableJsMap2);
  })
  .add('mori (equals)', function () {
    mori.equals(moriHashMap, moriHashMap2);
  });

[
  createSuite,
  setSuite,
  getSuite,
  removeSuite,
  mergeSuite,
  equalsSuite,
].forEach(function (suite) {
  suite
    .on('start', () => console.log(suite.name))
    .on('cycle', (event) => console.log('\t' + String(event.target)))
    .on('complete', function () {
      console.log('\tFastest is ' + this.filter('fastest').map('name'));
    })
    .run({async: false});
});
