import assert from 'node:assert/strict';
import test from 'node:test';

import fc from 'fast-check';

import * as wbt from '../src/index.js';

import checkTreeInvariants from './checkTreeInvariants.js';
import compareIntegers from './compareIntegers.js';
import {
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

const uniqueIntegers = (keys) => Array.from(new Set(keys));

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

    real.tree = wbt.insertIfNotExists(
      real.tree,
      this.key,
      compareIntegers,
    );

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
    this.keys = uniqueIntegers(keys).sort(compareIntegers);
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
    this.keys = uniqueIntegers(keys).sort(compareIntegers);
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

const keyArb = fc.integer({min: -10_000, max: 10_000});

const commandArb = [
  keyArb.map(key => new InsertCmd(key)),
  keyArb.map(key => new RemoveCmd(key)),
  fc.array(keyArb, {maxLength: 50}).map(keys => new UnionCmd(keys)),
  fc.array(keyArb, {maxLength: 50}).map(keys => new DifferenceCmd(keys)),
];

test('weight-balanced-tree', () => {
  fc.assert(
    fc.property(
      fc.commands(commandArb, {maxCommands: 5_000, size: 'max'}),
      function (cmds) {
        const initial = {
          model: [],
          real: {tree: null},
        };
        fc.modelRun(() => ({...initial}), cmds);
      },
    ),
    {numRuns: 10, endOnFailure: true, verbose: true},
  );
});
