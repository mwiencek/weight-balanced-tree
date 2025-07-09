import {Bench} from 'tinybench';
import * as Immutable from 'immutable';
import mori from 'mori';

import * as wbt from '../src/index.js';
import compareIntegers from '../test/compareIntegers.js';
import shuffle from '../test/shuffle.js';

const setData = [];
for (let i = 0; i < 32768; i++) {
  setData.push(i);
}
shuffle(setData);
const setDataHalf1 = setData.slice(0, setData.length / 2);
const setDataHalf2 = setData.slice(setData.length / 2, setData.length);

/*
 * NOTE: Immutable.js doesn't have a value-sorted set. We use a regular Set,
 * and factor in the cost of sorting the values manually in the iteration
 * test.
 */

function buildWeightBalancedTree(data) {
  let set = wbt.empty;
  for (const i of data) {
    set = wbt.insert(set, i, compareIntegers);
  }
  return set;
}

function buildImmutableJsSet(data) {
  let set = Immutable.Set();
  for (const i of data) {
    set = set.add(i);
  }
  return set;
}

function buildMoriSortedSet(data) {
  let set = mori.sortedSet();
  for (const i of data) {
    set = mori.conj(set, i);
  }
  return set;
}

const setDataCopy1 = setData.slice(0);

const createSuite = new Bench({name: 'Sorted set create', time: 100})
  .add('weight-balanced-tree (fromDistinctAscArray)', function () {
    setDataCopy1.sort(compareIntegers);
    wbt.fromDistinctAscArray(setDataCopy1);
  })
  .add('Immutable.Set (constructor)', function () {
    setDataCopy1.sort(compareIntegers);
    new Immutable.Set(setDataCopy1);
  })
  .add('mori (sortedSet)', function () {
    setDataCopy1.sort(compareIntegers);
    mori.sortedSet(...setDataCopy1);
  });

const setSuite = new Bench({name: 'Sorted set add', time: 100})
  .add('weight-balanced-tree (insert)', function () {
    buildWeightBalancedTree(setData);
  })
  .add('Immutable.Set (add)', function () {
    buildImmutableJsSet(setData);
  })
  .add('mori (conj)', function () {
    buildMoriSortedSet(setData);
  });

const weightBalancedTree = buildWeightBalancedTree(setData);
const immutableJsSet = buildImmutableJsSet(setData);
const moriSortedSet = buildMoriSortedSet(setData);
// XXX https://github.com/swannodette/mori/issues/173
moriSortedSet[Symbol.iterator] = moriSortedSet.__proto__['undefined'];

const getSuite = new Bench({name: 'Sorted set has', time: 100})
  .add('weight-balanced-tree (findBy)', function () {
    for (const i of setData) {
      wbt.findBy(
        weightBalancedTree,
        (treeValue) => compareIntegers(i, treeValue),
      );
    }
  })
  .add('Immutable.Set (has)', function () {
    for (const i of setData) {
      immutableJsSet.has(i);
    }
  })
  .add('mori (hasKey)', function () {
    for (const i of setData) {
      mori.hasKey(moriSortedSet, i);
    }
  });

const removeSuite = new Bench({name: 'Sorted set remove', time: 100})
  .add('weight-balanced-tree (remove)', function () {
    let set = weightBalancedTree;
    for (const i of setData) {
      set = wbt.remove(set, i, (treeValue) => compareIntegers(i, treeValue));
    }
  })
  .add('Immutable.Set (delete)', function () {
    let set = immutableJsSet;
    for (const i of setData) {
      set.delete(i);
    }
  })
  .add('mori (disj)', function () {
    let set = moriSortedSet;
    for (const i of setData) {
      set = mori.disj(set, i);
    }
  });

const weightBalancedTreeHalf1 = buildWeightBalancedTree(setDataHalf1);
const weightBalancedTreeHalf2 = buildWeightBalancedTree(setDataHalf2);
const immutableJsSetHalf1 = buildImmutableJsSet(setDataHalf1);
const immutableJsSetHalf2 = buildImmutableJsSet(setDataHalf2);
const moriSortedSetHalf1 = buildMoriSortedSet(setDataHalf1);
const moriSortedSetHalf2 = buildMoriSortedSet(setDataHalf2);

const mergeSuite = new Bench({name: 'Sorted set union', time: 100})
  .add('weight-balanced-tree (union)', function () {
    wbt.union(weightBalancedTreeHalf1, weightBalancedTreeHalf2, compareIntegers);
  })
  .add('Immutable.Set (union)', function () {
    immutableJsSetHalf1.union(immutableJsSetHalf2);
  })
  .add('mori (into)', function () {
    mori.into(moriSortedSetHalf1, moriSortedSetHalf2);
  });

const weightBalancedTree2 = buildWeightBalancedTree(setData);
const immutableJsSet2 = buildImmutableJsSet(setData);
const moriSortedSet2 = buildMoriSortedSet(setData);

const equalsSuite = new Bench({name: 'Sorted set equals', time: 100})
  .add('weight-balanced-tree (equals)', function () {
    wbt.equals(weightBalancedTree, weightBalancedTree2);
  })
  .add('Immutable.Set (equals)', function () {
    immutableJsSet.equals(immutableJsSet2);
  })
  .add('mori (equals)', function () {
    mori.equals(moriSortedSet, moriSortedSet2);
  });

const iterationSuite = new Bench({name: 'Sorted set iteration', time: 100})
  .add('weight-balanced-tree (iterate, Iterator protocol)', function () {
    // eslint-disable-next-line no-unused-vars
    for (const _ of wbt.iterate(weightBalancedTree));
  })
  .add('Immutable.Set (toArray, sort, Iterator protocol)', function () {
    const sortedValues = immutableJsSet.toArray().sort(compareIntegers);
    // eslint-disable-next-line no-unused-vars
    for (const _ of sortedValues);
  })
  .add('mori (Iterator protocol)', function () {
    // eslint-disable-next-line no-unused-vars
    for (const _ of moriSortedSet);
  });

(async () => {
  for (const bench of [
    createSuite,
    setSuite,
    getSuite,
    removeSuite,
    mergeSuite,
    equalsSuite,
    iterationSuite,
  ]) {
    await bench.run()
    console.log(bench.name)
    console.table(bench.table());
  }
})();
