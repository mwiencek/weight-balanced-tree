import assert from 'node:assert/strict';
import test from 'node:test';

import fc from 'fast-check';

import * as wbt from '../src/index.js';
import join2 from '../src/join2.js';

import checkTreeInvariants from './checkTreeInvariants.js';
import compareIntegers from './compareIntegers.js';
import {
  getSortedArrayIndex,
  sortedArrayFindOrInsert,
  sortedArrayRemove,
} from './sortedArray.js';

const compareModelToReal = (model, real) => {
  assert.deepEqual(
    wbt.toArray(real.tree),
    model.array,
    'real tree and model array should have the same values',
  );
};

const uniqueIntegers = (keys) => Array.from(new Set(keys)).sort(compareIntegers);

class InsertCmd {
  constructor(key) {
    this.key = key;
  }
  toString() {
    return `insert(${this.key})`;
  }
  check() {
    return true;
  }
  run(model, real) {
    sortedArrayFindOrInsert(
      model.array,
      this.key,
      compareIntegers,
      /* copy = */ false,
    );

    const keyExists = wbt.find(real.tree, this.key, compareIntegers);

    const newTree = wbt.insertIfNotExists(
      real.tree,
      this.key,
      compareIntegers,
    );

    if (keyExists) {
      assert.ok(newTree === real.tree);
    }

    real.tree = newTree;

    assert.ok(checkTreeInvariants(real.tree, compareIntegers));
    compareModelToReal(model, real);
  }
}

class RemoveCmd {
  constructor(key) {
    this.key = key;
  }
  toString() {
    return `remove(${this.key})`;
  }
  check() {
    return true;
  }
  run(model, real) {
    sortedArrayRemove(
      model.array,
      this.key,
      compareIntegers,
      /* copy = */ false,
    );

    real.tree = wbt.removeIfExists(
      real.tree,
      this.key,
      compareIntegers,
    );

    assert.ok(checkTreeInvariants(real.tree, compareIntegers));
    compareModelToReal(model, real);
  }
}

class UnionCmd {
  constructor(keys) {
    this.keys = uniqueIntegers(keys);
  }
  toString() {
    return `union(${this.keys})`;
  }
  check() {
    return true;
  }
  run(model, real) {
    for (const key of this.keys) {
      sortedArrayFindOrInsert(
        model.array,
        key,
        compareIntegers,
        /* copy = */ false,
      );
    }

    real.tree = wbt.union(
      real.tree,
      wbt.fromDistinctAscArray(this.keys),
      compareIntegers,
    );

    assert.ok(checkTreeInvariants(real.tree, compareIntegers));
    compareModelToReal(model, real);
  }
}

class DifferenceCmd {
  constructor(keys) {
    this.keys = uniqueIntegers(keys);
  }
  toString() {
    return `difference(${this.keys})`;
  }
  check() {
    return true;
  }
  run(model, real) {
    for (const key of this.keys) {
      sortedArrayRemove(
        model.array,
        key,
        compareIntegers,
        /* copy = */ false,
      );
    }

    real.tree = wbt.difference(
      real.tree,
      wbt.fromDistinctAscArray(this.keys),
      compareIntegers,
    );

    assert.ok(checkTreeInvariants(real.tree, compareIntegers));
    compareModelToReal(model, real);
  }
}

class IntersectionCmd {
  constructor(keys) {
    this.keys = uniqueIntegers(keys);
  }
  toString() {
    return `intersection(${this.keys})`;
  }
  check() {
    return true;
  }
  run(model, real) {
    const keySet = new Set(this.keys);
    model.array = model.array.filter(keySet.has.bind(keySet));
    real.tree = wbt.intersection(
      real.tree,
      wbt.fromDistinctAscArray(this.keys),
      compareIntegers,
    );
    assert.ok(checkTreeInvariants(real.tree, compareIntegers));
    compareModelToReal(model, real);
  }
}

class SymmetricDifferenceCmd {
  constructor(keys) {
    this.keys = uniqueIntegers(keys);
  }
  toString() {
    return `symmetricDifference(${this.keys})`;
  }
  check() {
    return true;
  }
  run(model, real) {
    const keySet = new Set(this.keys);
    const modelKeySet = new Set(model.array);

    model.array = (
      model.array
        .filter((key) => !keySet.has(key))
        .concat(this.keys.filter((key) => !modelKeySet.has(key)))
    ).sort(compareIntegers);

    real.tree = wbt.symmetricDifference(
      real.tree,
      wbt.fromDistinctAscArray(this.keys),
      compareIntegers,
    );
    assert.ok(checkTreeInvariants(real.tree, compareIntegers));
    compareModelToReal(model, real);
  }
}

class SliceCmd {
  constructor(args) {
    this.start = args.start;
    this.end = args.end;
  }
  toString() {
    return `slice(${this.start}, ${this.end})`;
  }
  check() {
    return true;
  }
  run(model, real) {
    model.array = model.array.slice(this.start, this.end);
    real.tree = wbt.slice(real.tree, this.start, this.end);
    assert.ok(checkTreeInvariants(real.tree, compareIntegers));
    compareModelToReal(model, real);
  }
}

class SpliceCmd {
  constructor(args) {
    this.start = args.start;
    this.deleteCount = args.deleteCount;
    this.items = args.items;
  }
  toString() {
    return `splice(${this.start}, ${this.deleteCount}, Array(${this.items.length}))`;
  }
  check() {
    return true;
  }
  run(model, real) {
    const rawStart = this.start;
    const rawDeleteCount = this.deleteCount;
    const modelSize = model.array.length;

    let actualStart = Math.min(Math.max(rawStart < 0 ? modelSize + rawStart : rawStart, 0), modelSize);
    const actualDeleteCount = Math.max(0, Math.min(rawDeleteCount, modelSize - actualStart));
    const itemMin = actualStart > 0 ? model.array[actualStart - 1] : -Infinity;
    const itemMax = actualStart + actualDeleteCount < modelSize
      ? model.array[actualStart + actualDeleteCount]
      : Infinity;
    const validItems = this.items.filter(x => x > itemMin && x < itemMax);

    const deletedFromModel = model.array.splice(rawStart, rawDeleteCount, ...validItems);
    const {tree: splicedTree, deleted: deletedFromTree} = wbt.splice(
      real.tree,
      rawStart,
      rawDeleteCount,
      wbt.fromDistinctAscArray(validItems),
    );
    real.tree = splicedTree;

    assert.ok(checkTreeInvariants(splicedTree, compareIntegers));
    assert.ok(checkTreeInvariants(deletedFromTree, compareIntegers));
    compareModelToReal(model, real);
    compareModelToReal({array: deletedFromModel}, {tree: deletedFromTree});
  }
}

class SplitCmd {
  constructor(key) {
    this.key = key;
  }
  toString() {
    return `split(${this.key})`;
  }
  check() {
    return true;
  }
  run(model, real) {
    const [modelIndex, keyExistsInModel] = getSortedArrayIndex(
      model.array,
      model.array.length,
      this.key,
      compareIntegers,
    );
    const smallArray = model.array.slice(0, modelIndex);
    const largeArray = model.array.slice(
      keyExistsInModel ? (modelIndex + 1) : modelIndex,
    );

    const [smallTree, equalTree, largeTree] = wbt.split(
      real.tree,
      this.key,
      compareIntegers,
    );

    if (model.array.length > 0) {
      if (this.key < model.array[0]) {
        assert.equal(smallTree.size, 0);
        assert.equal(equalTree.size, 0);
        assert.equal(largeTree, real.tree);
      } else if (this.key > model.array[model.array.length - 1]) {
        assert.equal(smallTree, real.tree);
        assert.equal(equalTree.size, 0);
        assert.equal(largeTree.size, 0);
      }
    }

    assert.equal(keyExistsInModel, equalTree.size !== 0);
    assert.ok(checkTreeInvariants(smallTree, compareIntegers));
    assert.ok(checkTreeInvariants(largeTree, compareIntegers));
    compareModelToReal({array: smallArray}, {tree: smallTree});
    compareModelToReal({array: largeArray}, {tree: largeTree});

    model.array = smallArray.concat(largeArray);
    real.tree = join2(smallTree, largeTree);

    assert.ok(checkTreeInvariants(real.tree, compareIntegers));
    compareModelToReal(model, real);
  }
}

class FilterCmd {
  constructor(key) {
    this.key = key;
  }
  toString() {
    return `filter(${this.key})`;
  }
  check() {
    return true;
  }
  run(model, real) {
    model.array = model.array.filter(x => x > this.key);
    real.tree = wbt.filter(
      real.tree,
      x => x > this.key,
    );
    assert.ok(checkTreeInvariants(real.tree, compareIntegers));
    compareModelToReal(model, real);
  }
}

const keyArb = fc.integer({min: -10_000, max: 10_000});

const commandArb = [
  keyArb.map(key => new InsertCmd(key)),
  keyArb.map(key => new RemoveCmd(key)),
  keyArb.map(key => new SplitCmd(key)),
  keyArb.map(key => new FilterCmd(key)),
  fc.array(keyArb, {maxLength: 50}).map(keys => new UnionCmd(keys)),
  fc.array(keyArb, {maxLength: 50}).map(keys => new DifferenceCmd(keys)),
  fc.array(keyArb, {maxLength: 50}).map(keys => new IntersectionCmd(keys)),
  fc.array(keyArb, {maxLength: 50}).map(keys => new SymmetricDifferenceCmd(keys)),
  fc.record({
    start: fc.integer({min: -1_000, max: 1_000}),
    end: fc.integer({min: -1_000, max: 1_000}),
  }).map(args => new SliceCmd(args)),
  fc.record({
    start: fc.integer({min: -1_000, max: 1_000}),
    deleteCount: fc.integer({min: -100, max: 100}),
    items: fc.array(keyArb, {maxLength: 100}).map(uniqueIntegers),
  }).map(args => new SpliceCmd(args)),
];

test('weight-balanced-tree', () => {
  fc.assert(
    fc.property(
      fc.commands(commandArb, {maxCommands: 5_000, size: 'max'}),
      function (cmds) {
        const initial = {
          model: {array: []},
          real: {tree: wbt.empty},
        };
        fc.modelRun(() => ({...initial}), cmds);
      },
    ),
    {numRuns: 10, endOnFailure: true, verbose: true},
  );
});
