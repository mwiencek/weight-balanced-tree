import {Bench} from 'tinybench';
import * as Immutable from 'immutable';
import mori from 'mori';

import * as wbt from '../src/index.js';
import compareIntegers from '../test/compareIntegers.js';

const setData = [];
for (let i = 0; i < 8192; i++) {
  setData.push(i);
}
const setDataHalf1 = setData.slice(0, setData.length / 2);
const setDataHalf2 = setData.slice(setData.length / 2, setData.length);

/*
 * NOTE: Immutable.js and JavaScript don't have a value-sorted set. We use
 * the normal `Set`s available from their APIs, and factor in the cost of
 * sorting the values manually in the iteration tests.
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

function buildJsSortedSet(data) {
  let set = new Set();
  for (const i of data) {
    set = new Set(set);
    set.add(i);
  }
  return set;
}

const createSuite = new Bench({name: 'Sorted set create', time: 100})
  .add('weight-balanced-tree (fromDistinctAscArray)', function () {
    setData.sort(compareIntegers);
    wbt.fromDistinctAscArray(setData);
  })
  .add('Immutable.Set (constructor)', function () {
    new Immutable.Set(setData);
  })
  .add('mori (sortedSet)', function () {
    mori.sortedSet(...setData);
  })
  .add('JavaScript Set (constructor)', function () {
    new Set(setData);
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
  })
  .add('JavaScript Set (add)', function () {
    buildJsSortedSet(setData);
  });

const weightBalancedTree = buildWeightBalancedTree(setData);
const immutableJsSet = buildImmutableJsSet(setData);
const moriSortedSet = buildMoriSortedSet(setData);
// XXX https://github.com/swannodette/mori/issues/173
moriSortedSet[Symbol.iterator] = moriSortedSet.__proto__['undefined'];
const jsSortedSet = new Set(setData);

const getSuite = new Bench({name: 'Sorted set has', time: 100})
  .add('weight-balanced-tree (exists)', function () {
    for (const i of setData) {
      wbt.exists(weightBalancedTree, i, compareIntegers);
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
  })
  .add('JavaScript Set (has)', function () {
    for (const i of setData) {
      jsSortedSet.has(i);
    }
  });

const removeSuite = new Bench({name: 'Sorted set remove', time: 100})
  .add('weight-balanced-tree (remove)', function () {
    let set = weightBalancedTree;
    for (const i of setData) {
      set = wbt.remove(set, i, compareIntegers);
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
  })
  .add('JavaScript Set (delete)', function () {
    let set = jsSortedSet;
    for (const i of setData) {
      set = new Set(set);
      set.delete(i);
    }
  });

const weightBalancedTreeHalf1 = buildWeightBalancedTree(setDataHalf1);
const weightBalancedTreeHalf2 = buildWeightBalancedTree(setDataHalf2);
const immutableJsSetHalf1 = buildImmutableJsSet(setDataHalf1);
const immutableJsSetHalf2 = buildImmutableJsSet(setDataHalf2);
const moriSortedSetHalf1 = buildMoriSortedSet(setDataHalf1);
const moriSortedSetHalf2 = buildMoriSortedSet(setDataHalf2);
const jsSortedSetHalf1 = new Set(setDataHalf1);
const jsSortedSetHalf2 = new Set(setDataHalf2);

const mergeSuite = new Bench({name: 'Sorted set union', time: 100})
  .add('weight-balanced-tree (union)', function () {
    wbt.union(weightBalancedTreeHalf1, weightBalancedTreeHalf2, compareIntegers);
  })
  .add('Immutable.Set (union)', function () {
    immutableJsSetHalf1.union(immutableJsSetHalf2);
  })
  .add('mori (into)', function () {
    mori.into(moriSortedSetHalf1, moriSortedSetHalf2);
  })
  .add('JavaScript Set (union)', function () {
    jsSortedSetHalf1.union(jsSortedSetHalf2);
  });

const intersectionSuite = new Bench({name: 'Sorted set intersection', time: 100})
  .add('weight-balanced-tree (intersection)', function () {
    wbt.intersection(weightBalancedTree, weightBalancedTreeHalf1, compareIntegers);
  })
  .add('Immutable.Set (intersection)', function () {
    immutableJsSet.intersect(immutableJsSetHalf1);
  })
  .add('mori (intersection)', function () {
    mori.intersection(moriSortedSet, moriSortedSetHalf1);
  })
  .add('JavaScript Set (intersection)', function () {
    jsSortedSet.intersection(jsSortedSetHalf1);
  });

const differenceSuite = new Bench({name: 'Sorted set difference', time: 100})
  .add('weight-balanced-tree (difference)', function () {
    wbt.difference(weightBalancedTree, weightBalancedTreeHalf1, compareIntegers);
  })
  .add('Immutable.Set (subtract)', function () {
    immutableJsSet.subtract(immutableJsSetHalf1);
  })
  .add('mori (difference)', function () {
    mori.difference(moriSortedSet, moriSortedSetHalf1);
  })
  .add('JavaScript Set (difference)', function () {
    jsSortedSet.difference(jsSortedSetHalf1);
  });

const symmetricDifferenceSuite = new Bench({name: 'Sorted set symmetric difference', time: 100})
  .add('weight-balanced-tree (symmetricDifference)', function () {
    wbt.symmetricDifference(weightBalancedTreeHalf1, weightBalancedTreeHalf2, compareIntegers);
  })
  .add('Immutable.Set (union, subtract, intersection)', function () {
    immutableJsSetHalf1.union(immutableJsSetHalf2).subtract(
      immutableJsSetHalf1.intersect(immutableJsSetHalf2)
    );
  })
  .add('mori (difference, into, intersection)', function () {
    mori.difference(
      mori.into(moriSortedSetHalf1, moriSortedSetHalf2),
      mori.intersection(moriSortedSetHalf1, moriSortedSetHalf2),
    );
  })
  .add('JavaScript Set (symmetricDifference)', function () {
    jsSortedSet.symmetricDifference(jsSortedSetHalf1);
  });

const subsetSuite = new Bench({name: 'Sorted set subset', time: 100})
  .add('weight-balanced-tree (isSubsetOf)', function () {
    wbt.isSubsetOf(weightBalancedTreeHalf1, weightBalancedTree, compareIntegers);
  })
  .add('Immutable.Set (isSubset)', function () {
    immutableJsSetHalf1.isSubset(immutableJsSet);
  })
  .add('mori (isSubset)', function () {
    mori.isSubset(moriSortedSetHalf1, moriSortedSet);
  })
  .add('JavaScript Set (isSubsetOf)', function () {
    jsSortedSetHalf1.isSubsetOf(jsSortedSet);
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
  })
  .add('JavaScript Set (isSubsetOf, isSupersetOf)', function () {
    jsSortedSet.isSubsetOf(jsSortedSetHalf1);
    jsSortedSet.isSupersetOf(jsSortedSetHalf1);
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
  })
  .add('JavaScript Set (Iterator protocol)', function () {
    const sortedValues = Array.from(jsSortedSet).sort(compareIntegers);
    // eslint-disable-next-line no-unused-vars
    for (const _ of sortedValues);
  });

(async () => {
  const suites = [
    createSuite,
    setSuite,
    getSuite,
    removeSuite,
    mergeSuite,
    equalsSuite,
    intersectionSuite,
    differenceSuite,
    symmetricDifferenceSuite,
    subsetSuite,
    iterationSuite,
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
