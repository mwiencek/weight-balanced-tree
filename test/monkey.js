import assert from 'node:assert/strict';
import test from 'node:test';

import fc from 'fast-check';

import * as wbt from '../src/index.js';

import checkTreeInvariants from './checkTreeInvariants.js';
import compareIntegers from './compareIntegers.js';
import {
  getSortedArrayIndex,
  sortedArrayFindOrInsert,
  sortedArrayRemove,
} from './sortedArray.js';

const compareModelToReal = (model, real) => {
  const treeArray = wbt.toArray(real.tree);
  const modelLength = model.length;
  assert.equal(modelLength, treeArray.length);
  for (let i = 0; i < modelLength; i++) {
    if (model[i] !== treeArray[i]) {
      assert.ok(false);
    }
  }
  assert.ok(true);
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
      model,
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
      model,
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
        model,
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
        model,
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
    const modelIntersection = model.filter(keySet.has.bind(keySet));
    const realIntersection = wbt.intersection(
      real.tree,
      wbt.fromDistinctAscArray(this.keys),
      compareIntegers,
    );
    assert.ok(checkTreeInvariants(realIntersection, compareIntegers));
    compareModelToReal(modelIntersection, {tree: realIntersection});
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

    let actualStart = Math.min(Math.max(rawStart < 0 ? model.length + rawStart : rawStart, 0), model.length);
    const actualDeleteCount = Math.max(0, Math.min(rawDeleteCount, model.length - actualStart));
    const itemMin = actualStart > 0 ? model[actualStart - 1] : -Infinity;
    const itemMax = actualStart + actualDeleteCount < model.length
      ? model[actualStart + actualDeleteCount]
      : Infinity;
    const validItems = this.items.filter(x => x > itemMin && x < itemMax);

    const splicedModel = model.slice();
    const deletedFromModel = splicedModel.splice(rawStart, rawDeleteCount, ...validItems);

    const {tree: splicedTree, deleted: deletedFromTree} = wbt.splice(
      real.tree,
      rawStart,
      rawDeleteCount,
      wbt.fromDistinctAscArray(validItems),
    );

    assert.ok(checkTreeInvariants(splicedTree, compareIntegers));
    assert.ok(checkTreeInvariants(deletedFromTree, compareIntegers));
    compareModelToReal(splicedModel, {tree: splicedTree});
    compareModelToReal(deletedFromModel, {tree: deletedFromTree});
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
      model,
      model.length,
      this.key,
      compareIntegers,
    );
    const smallModel = model.slice(0, modelIndex);
    const largeModel = model.slice(
      keyExistsInModel ? (modelIndex + 1) : modelIndex,
    );

    const [smallTree, equalTree, largeTree] = wbt.split(
      real.tree,
      this.key,
      compareIntegers,
    );

    if (model.length > 0) {
      if (this.key < model[0]) {
        assert.equal(smallTree.size, 0);
        assert.equal(equalTree.size, 0);
        assert.equal(largeTree, real.tree);
      } else if (this.key > model[model.length - 1]) {
        assert.equal(smallTree, real.tree);
        assert.equal(equalTree.size, 0);
        assert.equal(largeTree.size, 0);
      }
    }

    assert.equal(keyExistsInModel, equalTree.size !== 0);
    assert.ok(checkTreeInvariants(smallTree, compareIntegers));
    assert.ok(checkTreeInvariants(largeTree, compareIntegers));
    compareModelToReal(smallModel, {tree: smallTree});
    compareModelToReal(largeModel, {tree: largeTree});
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
    const filteredModel = model.filter(x => x > this.key);
    const filteredTree = wbt.filter(
      real.tree,
      x => x > this.key,
    );
    assert.ok(checkTreeInvariants(filteredTree, compareIntegers));
    compareModelToReal(filteredModel, {tree: filteredTree});
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
          model: [],
          real: {tree: wbt.empty},
        };
        fc.modelRun(() => ({...initial}), cmds);
      },
    ),
    {numRuns: 10, endOnFailure: true, verbose: true},
  );
});
