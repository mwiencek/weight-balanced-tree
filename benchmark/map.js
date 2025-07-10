import {Bench} from 'tinybench'
import * as Immutable from 'immutable';
import mori from 'mori';

import * as wbt from '../src/index.js';
import shuffle from '../test/shuffle.js';

const mapData = [];
for (let i = 0; i < 8192; i++) {
  mapData.push([
    /* key:   */ String.fromCharCode(i).repeat(7),
    /* value: */ i * 7,
  ]);
}
shuffle(mapData);
const mapDataHalf1 = mapData.slice(0, mapData.length / 2);
const mapDataHalf2 = mapData.slice(mapData.length / 2, mapData.length);

const areMapEntriesEqual = (a, b) => {
  return a[0] === b[0] && a[1] === b[1];
};

const compareKeys = ([a], [b]) => {
  return a === b ? 0 : (a < b ? -1 : 1);
};

const compareKeyWithEntry = (key, [entryKey]) => {
  return key === entryKey ? 0 : (key < entryKey ? -1 : 1);
};

function buildWeightBalancedTree(data) {
  let map = wbt.empty;
  for (const keyValuePair of data) {
    map = wbt.insert(map, keyValuePair, compareKeys);
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

const createSuite = new Bench({name: 'Map create', time: 100})
  .add('weight-balanced-tree (fromDistinctAscArray)', function () {
    mapDataCopy1.sort(compareKeys);
    wbt.fromDistinctAscArray(mapDataCopy1);
  })
  .add('Immutable.Map (constructor)', function () {
    new Immutable.Map(mapData);
  })
  .add('mori (hashMap)', function () {
    mori.hashMap(...mapData);
  });

const setSuite = new Bench({name: 'Map set', time: 100})
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

const getSuite = new Bench({name: 'Map get', time: 100})
  .add('weight-balanced-tree (find)', function () {
    for (const [key] of mapData) {
      wbt.find(weightBalancedTree, key, compareKeyWithEntry);
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

const removeSuite = new Bench({name: 'Map remove', time: 100})
  .add('weight-balanced-tree (remove)', function () {
    let map = weightBalancedTree;
    for (const [key] of mapData) {
      map = wbt.remove(map, key, compareKeyWithEntry);
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

const mergeSuite = new Bench({name: 'Map merge', time: 100})
  .add('weight-balanced-tree (union)', function () {
    wbt.union(weightBalancedTreeHalf1, weightBalancedTreeHalf2, compareKeys);
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

const equalsSuite = new Bench({name: 'Map equals', time: 100})
  .add('weight-balanced-tree (equals)', function () {
    wbt.equals(weightBalancedTree, weightBalancedTree2, areMapEntriesEqual);
  })
  .add('Immutable.Map (equals)', function () {
    immutableJsMap.equals(immutableJsMap2);
  })
  .add('mori (equals)', function () {
    mori.equals(moriHashMap, moriHashMap2);
  });

(async () => {
  const suites = [
    createSuite,
    setSuite,
    getSuite,
    removeSuite,
    mergeSuite,
    equalsSuite,
  ];

  await Promise.all(suites.map(s => s.run()));

  for (const bench of suites) {
    console.log(bench.name)
    console.table(bench.table.call({
      tasks: bench.tasks.sort((a, b) => (
        (b.result?.throughput?.mean ?? 0) - (a.result?.throughput?.mean ?? 0)
      )),
    }));
  }
})();
