// @flow strict

import assert from 'node:assert/strict';
// $FlowIssue[cannot-resolve-module]
import test from 'node:test';

import checkTreeInvariants from './checkTreeInvariants.js';
import compareIntegers from './compareIntegers.js';
import {
  EmptyTreeError,
  IndexOutOfRangeError,
  ValueExistsError,
  ValueNotFoundError,
  ValueOrderError,
} from '../src/errors.js';
import * as tree from '../src/index.js';
import {
  onConflictKeepTreeValue,
  onConflictThrowError,
  onConflictUseGivenValue,
  onNotFoundDoNothing,
  onNotFoundThrowError,
  onNotFoundUseGivenValue,
} from '../src/update.js';
import withKeyComparator from '../src/withKeyComparator.js';
/*::
import invariant from '../src/invariant.js';
import type {ImmutableTree} from '../src/types.js';
*/

import shuffle from './shuffle.js';

const compareStringX = (
  a/*: {+x: string} */,
  b/*: {+x: string} */,
)/*: number */ => a.x.localeCompare(b.x);

const compareIntegersReverse = (
  a/*: number */,
  b/*: number */,
)/*: number */ => compareIntegers(b, a);

// $FlowIssue[method-unbinding]
const objectIs/*: <T>(a: T, b: T) => boolean */ = Object.is;

const oneToThirtyOne = [];

for (let i = 1; i <= 31; i++) {
  oneToThirtyOne.push(i);
}

test('all', function () {
  const thirtyOneToOne = oneToThirtyOne.slice(0).reverse();

  const numbers = oneToThirtyOne.slice(0);

  for (let i = 0; i < 5; i++) {
    let node/*: ImmutableTree<number> */ = tree.empty;

    for (const num of numbers) {
      node = tree.insert(node, num, compareIntegers);
      assert.ok(checkTreeInvariants(node, compareIntegers), 'tree is valid and balanced');
    }

    assert.deepEqual(
      Array.from(tree.iterate(node)),
      oneToThirtyOne,
      'tree is in order',
    );

    assert.deepEqual(
      Array.from(tree.reverseIterate(node)),
      thirtyOneToOne,
      'tree is in order (reversed)',
    );

    assert.throws(
      () => { tree.minNode/*:: <number> */(tree.empty); },
      EmptyTreeError,
      'minNode throws EmptyTreeError',
    );
    assert.throws(
      () => { tree.maxNode/*:: <number> */(tree.empty); },
      EmptyTreeError,
      'maxNode throws EmptyTreeError',
    );

    assert.equal(tree.minNode(node).value, 1, 'min node value is 1');
    assert.equal(tree.maxNode(node).value, 31, 'max node value is 31');
    assert.equal(tree.minValue(node), 1, 'min value is 1');
    assert.equal(tree.maxValue(node), 31, 'max value is 31');

    shuffle(numbers);

    for (const num of numbers) {
      const next = tree.findNext(node, num, compareIntegers, -1);
      assert.equal(
        next,
        num < 31 ? (num + 1) : -1,
        'next node is found',
      );

      const prev = tree.findPrev(node, num, compareIntegers, -1);
      assert.equal(
        prev,
        num > 1 ? (num - 1) : -1,
        'prev node is found',
      );
    }

    for (const num of numbers) {
      let foundValue = tree.find(node, num, compareIntegers, null);
      assert.ok(foundValue === num, 'existing node is found with find');

      foundValue = tree.findBy(node, x => compareIntegers(num, x), null);
      assert.ok(foundValue === num, 'existing node is found with findBy');

      node = tree.remove(node, num, compareIntegers);
      assert.ok(checkTreeInvariants(node, compareIntegers), 'tree is valid and balanced');

      foundValue = tree.find(node, num, compareIntegers, -1);
      assert.ok(foundValue === -1, 'removed node is not found');
    }

    assert.equal(node, tree.empty, 'tree is empty');

    node = tree.remove(node, 0, compareIntegers);
    assert.equal(node, tree.empty, 'tree is still empty');
  }
});

test('find/findBy with different value type', function () {
  const compareX2 = (
    x/*: string */,
    value/*: {+x: string} */,
  )/*: number */ => x.localeCompare(value.x);

  const xa = {x: 'a'};
  const xb = {x: 'b'};

  let node/*: ImmutableTree<{+x: string}> */ = tree.empty;
  node = tree.insert(node, xa, compareStringX);
  node = tree.insert(node, xb, compareStringX);

  let foundValue = tree.find(node, 'b', compareX2, null);
  assert.ok(foundValue?.x === 'b');
  foundValue = tree.find(node, 'c', compareX2, {x: 'c'});
  assert.ok(foundValue.x === 'c');

  foundValue = tree.findBy(node, (x) => compareX2('b', x), null);
  assert.ok(foundValue?.x === 'b');
  foundValue = tree.findBy(node, (x) => compareX2('c', x), {x: 'c'});
  assert.ok(foundValue.x === 'c');
});

test('findNext/findPrev with non-existent values', function () {
  let node/*: ImmutableTree<number> */ = tree.empty;
  node = tree.insert(node, 1, compareIntegers);
  node = tree.insert(node, 3, compareIntegers);
  node = tree.insert(node, 5, compareIntegers);
  node = tree.insert(node, 7, compareIntegers);
  node = tree.insert(node, 9, compareIntegers);

  assert.equal(tree.findNext(node, 0, compareIntegers, null), 1);
  assert.equal(tree.findNext(node, 1, compareIntegers, null), 3);
  assert.equal(tree.findNext(node, 2, compareIntegers, null), 3);
  assert.equal(tree.findNext(node, 3, compareIntegers, null), 5);
  assert.equal(tree.findNext(node, 4, compareIntegers, null), 5);
  assert.equal(tree.findNext(node, 5, compareIntegers, null), 7);
  assert.equal(tree.findNext(node, 6, compareIntegers, null), 7);
  assert.equal(tree.findNext(node, 7, compareIntegers, null), 9);
  assert.equal(tree.findNext(node, 8, compareIntegers, null), 9);
  assert.equal(tree.findNext(node, 9, compareIntegers, null), null);

  assert.equal(tree.findPrev(node, 1, compareIntegers, null), null);
  assert.equal(tree.findPrev(node, 2, compareIntegers, null), 1);
  assert.equal(tree.findPrev(node, 3, compareIntegers, null), 1);
  assert.equal(tree.findPrev(node, 4, compareIntegers, null), 3);
  assert.equal(tree.findPrev(node, 5, compareIntegers, null), 3);
  assert.equal(tree.findPrev(node, 6, compareIntegers, null), 5);
  assert.equal(tree.findPrev(node, 7, compareIntegers, null), 5);
  assert.equal(tree.findPrev(node, 8, compareIntegers, null), 7);
  assert.equal(tree.findPrev(node, 9, compareIntegers, null), 7);
  assert.equal(tree.findPrev(node, 10, compareIntegers, null), 9);
});

test('insertIfNotExists', function () {
  const cmp = (
    a/*: {+value: number} */,
    b/*: {+value: number} */,
  )/*: number */ => compareIntegers(a.value, b.value);

  let node/*: ImmutableTree<{+value: number}> */ = tree.empty;
  for (const num of oneToThirtyOne) {
    node = tree.insert(node, {value: num}, cmp, onConflictKeepTreeValue);

    const sameNode1 = tree.insert(node, {value: num}, cmp, onConflictKeepTreeValue);
    assert.equal(node, sameNode1);

    const sameNode2 = tree.insertIfNotExists(node, {value: num}, cmp);
    assert.equal(node, sameNode2);
  }

  const finalNode = node;
  for (const num of oneToThirtyOne) {
    node = tree.insert(node, {value: num}, cmp, onConflictKeepTreeValue);
    node = tree.insertIfNotExists(node, {value: num}, cmp);
  }
  assert.equal(node, finalNode);

  assert.equal(node.size, 31);
});

test('insertOrReplaceIfExists', function () {
  const cmp = (
    a/*: {+value: number} */,
    b/*: {+value: number} */,
  )/*: number */ => compareIntegers(a.value, b.value);

  let node/*: ImmutableTree<{+value: number}> */ = tree.empty;
  for (const num of oneToThirtyOne) {
    node = tree.insert(node, {value: num}, cmp, onConflictUseGivenValue);
    checkTreeInvariants(node, cmp);
  }

  for (const num of oneToThirtyOne) {
    const newValue1 = {value: num};
    const newNode1 = tree.insert(node, newValue1, cmp, onConflictUseGivenValue);
    checkTreeInvariants(newNode1, cmp);
    assert.notEqual(node, newNode1);
    assert.equal(tree.find(newNode1, {value: num}, cmp, null), newValue1);
  }

  for (const num of oneToThirtyOne) {
    const newValue2 = {value: num};
    const newNode2 = tree.insertOrReplaceIfExists(node, newValue2, cmp);
    checkTreeInvariants(newNode2, cmp);
    assert.notEqual(node, newNode2);
    assert.equal(tree.find(newNode2, {value: num}, cmp, null), newValue2);
  }

  assert.equal(node.size, 31);
});

test('insertOrThrowIfExists', function () {
  const cmp = (
    a/*: {+value: number} */,
    b/*: {+value: number} */,
  )/*: number */ => compareIntegers(a.value, b.value);

  let node/*: ImmutableTree<{+value: number}> */ = tree.empty;
  for (const num of oneToThirtyOne) {
    node = tree.insert(node, {value: num}, cmp);
    assert.throws(
      function () {
        node = tree.insertOrThrowIfExists(node, {value: num}, cmp);
      },
      ValueExistsError,
      'exception is thrown with insertOrThrowIfExists',
    );
    assert.throws(
      function () {
        node = tree.insert(node, {value: num}, cmp, onConflictThrowError);
      },
      ValueExistsError,
      'exception is thrown with insert plus onConflictThrowError',
    );
    assert.throws(
      function () {
        node = tree.insert(node, {value: num}, cmp);
      },
      ValueExistsError,
      'exception is thrown with insert by default',
    );
  }

  assert.equal(node.size, 31);
});

test('replacing a node preserves the existing node size', function () {
  assert.equal(
    tree.insertOrReplaceIfExists(
      {
        left: tree.empty,
        right: {
          left: tree.empty,
          right: tree.empty,
          size: 1,
          value: {value: 2},
        },
        size: 2,
        value: {value: 1},
      },
      {value: 1},
      (a, b) => compareIntegers(a.value, b.value),
    ).size,
    2,
  );
});

test('removeIfExists', function () {
  let node/*: ImmutableTree<number> */ = tree.create(1);
  node = tree.insert(node, 2, compareIntegers);

  const origNode = node;
  node = tree.removeIfExists(node, 3, compareIntegers);
  assert.equal(node, origNode);
  node = tree.remove(node, 3, compareIntegers);
  assert.equal(node, origNode);
  const node2 = tree.removeIfExists(node, 2, compareIntegers);
  assert.equal(node2.size, 1);
  assert.equal(node2.value, 1);
  const node3 = tree.remove(node, 2, compareIntegers);
  assert.equal(node3.size, 1);
  assert.equal(node3.value, 1);
  const node4 = tree.removeIfExists(node2, 1, compareIntegers);
  assert.equal(node4, tree.empty);
  const node5 = tree.remove(node3, 1, compareIntegers);
  assert.equal(node5, tree.empty);
  const node6 = tree.removeIfExists(tree.empty, 1, compareIntegers);
  assert.equal(node6, tree.empty);
  const node7 = tree.remove(tree.empty, 1, compareIntegers);
  assert.equal(node7, tree.empty);

  node = tree.fromDistinctAscArray(oneToThirtyOne);

  let size = 31;
  for (const num of oneToThirtyOne) {
    node = tree.removeIfExists(node, num, compareIntegers);
    checkTreeInvariants(node, compareIntegers);
    assert.equal(tree.find(node, num, compareIntegers, null), null);
    assert.equal(node.size, --size);
  }

  assert.equal(node, tree.empty, 'tree is empty');
});

test('removeOrThrowIfNotExists', function () {
  let node/*: ImmutableTree<number> */ = tree.create(1);
  assert.throws(
    function () {
      node = tree.removeOrThrowIfNotExists(node, 2, compareIntegers);
    },
    ValueNotFoundError,
    'exception is thrown with removeOrThrowIfNotExists',
  );
  assert.equal(node.size, 1);
  node = tree.removeOrThrowIfNotExists(node, 1, compareIntegers);
  assert.equal(node, tree.empty, 'tree is empty');
});

test('remove returns the same tree back if there is no value to remove', function () {
  let node/*: ImmutableTree<number> */ = tree.empty;
  for (const num of oneToThirtyOne) {
    node = tree.insert(node, num, compareIntegers);
  }

  const origNode = node;
  for (const num of oneToThirtyOne) {
    node = tree.remove(node, num + 31, compareIntegers);
    checkTreeInvariants(node, compareIntegers);
    assert.equal(node, origNode);
  }
  for (const num of oneToThirtyOne) {
    node = tree.remove(node, num - 31, compareIntegers);
    checkTreeInvariants(node, compareIntegers);
    assert.equal(node, origNode);
  }
});

test('create', function () {
  const node = tree.create(1);
  assert.deepEqual(node, {
    left: tree.empty,
    right: tree.empty,
    size: 1,
    value: 1,
  });
});

test('insert with onConflict', function () {
  /*:: type Item = {+key: number, +value: number}; */

  const cmp = (a/*: Item */, b/*: Item */) => compareIntegers(a.key, b.key);
  const cmpKeyWithItem = (key/*: number */, item/*: Item */) => compareIntegers(key, item.key);

  let v1 = {key: 1, value: 10};
  let node = tree.create(v1);

  node = tree.insert(
    node,
    {key: 1, value: 100},
    cmp,
    (treeValue, newValue) => {
      assert.equal(treeValue, v1);
      assert.deepEqual(newValue, {key: 1, value: 100});
      v1 = {key: 1, value: 1000};
      return v1;
    },
  );
  assert.equal(tree.find(node, 1, cmpKeyWithItem, null), v1);
  assert.deepEqual(v1, {key: 1, value: 1000});

  assert.throws(
    function () {
      node = tree.insert(
        node,
        v1,
        cmp,
        () => {
          return {key: 2, value: 20};
        },
      );
    },
    ValueOrderError,
  );
});

test('update', function () {
  /*:: type Item = {+key: number, +value: number}; */

  const cmp = (a/*: Item */, b/*: Item */) => compareIntegers(a.key, b.key);
  const cmpKeyWithItem = (key/*: number */, item/*: Item */) => compareIntegers(key, item.key);

  const v1 = {key: 1, value: 10};
  const v2 = {key: 2, value: 20};

  let node/*: ImmutableTree<Item> */ = tree.create(v1);

  node = tree.update(
    node,
    v2,
    cmp,
    onConflictThrowError,
    (newItem) => {
      assert.equal(newItem, v2);
      return v2;
    },
  );
  assert.equal(tree.find(node, v2, cmp, null), v2);

  node = tree.update(
    node,
    3,
    cmpKeyWithItem,
    onConflictThrowError,
    (newKey) => {
      return {key: newKey, value: newKey * 10};
    },
  );
  let v3 = tree.find(node, 3, cmpKeyWithItem, null);
  assert.deepEqual(v3, {key: 3, value: 30});

  node = tree.update(
    node,
    3,
    cmpKeyWithItem,
    onConflictKeepTreeValue,
    (newKey) => {
      return {key: newKey, value: newKey * 10};
    },
  );
  assert.deepEqual(
    tree.find(node, 3, cmpKeyWithItem, null),
    v3,
    'existing tree value it kept',
  );

  node = tree.update(
    node,
    3,
    cmpKeyWithItem,
    (treeValue, key) => {
      v3 = {key, value: key * 10};
      return v3;
    },
    () => {
      throw new Error('unexpected');
    },
  );
  assert.deepEqual(
    tree.find(node, 3, cmpKeyWithItem, null),
    v3,
    'new tree value is used',
  );

  assert.throws(
    function () {
      node = tree.update(
        node,
        {key: 4, value: 40},
        cmp,
        onConflictKeepTreeValue,
        (newValue) => {
          return {key: 5, value: 50};
        },
      );
    },
    ValueOrderError,
  );

  class CustomNotFoundError extends Error {}

  assert.throws(
    function () {
      node = tree.update(
        node,
        5,
        cmpKeyWithItem,
        (treeValue, key) => treeValue,
        () => {
          throw new CustomNotFoundError();
        },
      );
    },
    CustomNotFoundError,
  );
});

test('onNotFoundDoNothing', function () {
  let node = tree.create(1);

  const newNode = tree.update(
    node,
    2,
    compareIntegers,
    onConflictThrowError,
    onNotFoundDoNothing,
  );
  assert.equal(newNode, node, 'tree was not updated with onNotFoundDoNothing');
});

test('onNotFoundThrowError', function () {
  assert.throws(
    () => {
      const node = tree.update/*:: <number, number> */(
        tree.empty,
        1,
        compareIntegers,
        onConflictKeepTreeValue,
        onNotFoundThrowError,
      );
    },
    ValueNotFoundError,
  );
});

test('onNotFoundUseGivenValue', function () {
  const node = tree.update/*:: <number, number> */(
    tree.empty,
    1,
    compareIntegers,
    onConflictKeepTreeValue,
    onNotFoundUseGivenValue,
  );
  assert.equal(node.value, 1);
});

test('difference', function () {
  assert.equal(tree.difference(tree.empty, tree.empty, compareIntegers), tree.empty);
  assert.deepEqual(
    tree.difference(tree.create(1), tree.empty, compareIntegers),
    tree.create(1),
  );
  assert.deepEqual(
    tree.difference(tree.empty, tree.create(1), compareIntegers),
    tree.empty,
  );
  assert.equal(
    tree.difference(
      tree.fromDistinctAscArray([1, 2, 3]),
      tree.fromDistinctAscArray([1, 2, 3]),
      compareIntegers,
    ),
    tree.empty,
  );
  assert.ok(
    tree.equals(
      tree.difference(
        tree.fromDistinctAscArray([1, 2, 3, 4]),
        tree.fromDistinctAscArray([2, 3, 4, 5]),
        compareIntegers,
      ),
      tree.create(1),
    ),
  );
  assert.ok(
    tree.equals(
      tree.difference(
        tree.fromDistinctAscArray([2, 3, 4, 5]),
        tree.fromDistinctAscArray([1, 2, 3, 4]),
        compareIntegers,
      ),
      tree.create(5),
    ),
  );
  assert.ok(
    tree.equals(
      tree.difference(
        tree.fromDistinctAscArray([1, 4]),
        tree.fromDistinctAscArray([1, 2, 3]),
        compareIntegers,
      ),
      tree.create(4),
    ),
  );
  assert.ok(
    tree.equals(
      tree.difference(
        tree.fromDistinctAscArray([1, 2, 3]),
        tree.fromDistinctAscArray([1, 4]),
        compareIntegers,
      ),
      tree.fromDistinctAscArray([2, 3]),
    ),
  );
  const oneToThirtyOneOdds =
    tree.fromDistinctAscArray(oneToThirtyOne.filter(x => x % 2));
  const oneToThirtyOneEvens =
    tree.fromDistinctAscArray(oneToThirtyOne.filter(x => !(x % 2)));
  assert.ok(
    tree.equals(
      tree.difference(
        tree.fromDistinctAscArray(oneToThirtyOne),
        oneToThirtyOneOdds,
        compareIntegers,
      ),
      oneToThirtyOneEvens,
    ),
  );
  assert.ok(
    tree.equals(
      tree.difference(
        tree.fromDistinctAscArray(oneToThirtyOne),
        oneToThirtyOneEvens,
        compareIntegers,
      ),
      oneToThirtyOneOdds,
    ),
  );
});


test('equals', function () {
  let tree1/*: ImmutableTree<number> */ = tree.empty;
  for (const num of oneToThirtyOne) {
    tree1 = tree.insert(tree1, num, compareIntegers);
  }

  let tree2/*: ImmutableTree<number> */ = tree.empty;
  for (const num of oneToThirtyOne.slice(0).reverse()) {
    tree2 = tree.insert(tree2, num, compareIntegers);
  }

  let stringTree/*: ImmutableTree<string> */ = tree.empty;
  for (const num of oneToThirtyOne) {
    stringTree = tree.insert(
      stringTree,
      String(num),
      (a, b) => parseInt(a, 10) - parseInt(b, 10),
    );
  }

  assert.ok(tree.equals(tree1, tree2));
  assert.ok(tree.equals/*:: <number, string> */(tree1, stringTree, (a, b) => a === parseInt(b, 10)));

  tree1 = tree.remove(tree1, 1, compareIntegers);
  assert.ok(!tree.equals(tree1, tree2));

  tree2 = tree.remove(tree2, 1, compareIntegers);
  assert.ok(tree.equals(tree1, tree2));

  assert.ok(tree.equals(tree.empty, tree.empty));
  assert.ok(!tree.equals(tree1, tree.empty));
  assert.ok(!tree.equals(tree.empty, tree1));

  assert.ok(tree.equals(
    {
      left: {
        left: tree.empty,
        right: tree.empty,
        size: 1,
        value: {num: 1},
      },
      right: tree.empty,
      size: 2,
      value: {num: 2},
    },
    {
      left: tree.empty,
      right: {
        left: tree.empty,
        right: tree.empty,
        size: 1,
        value: {num: 2},
      },
      size: 2,
      value: {num: 1},
    },
    (a, b) => objectIs(a.num, b.num),
  ));

  assert.ok(!tree.equals(
    {
      left: {
        left: tree.empty,
        right: tree.empty,
        size: 1,
        value: {num: 1},
      },
      right: {
        left: tree.empty,
        right: tree.empty,
        size: 1,
        value: {num: 3},
      },
      size: 2,
      value: {num: 2},
    },
    {
      left: {
        left: tree.empty,
        right: tree.empty,
        size: 1,
        value: {num: 0},
      },
      right: {
        left: tree.empty,
        right: tree.empty,
        size: 1,
        value: {num: 2},
      },
      size: 2,
      value: {num: 1},
    },
    (a, b) => objectIs(a.num, b.num),
  ));
});

test('fromDistinctAscArray', function () {
  const node = tree.fromDistinctAscArray(oneToThirtyOne);
  assert.ok(checkTreeInvariants(node, compareIntegers), 'tree is valid and balanced');
});

test('map', function () {
  const toString = (x/*: mixed */)/*: string */ => String(x);

  assert.equal(tree.map(tree.empty, toString), tree.empty);
  assert.deepEqual(
    tree.map(
      tree.fromDistinctAscArray(oneToThirtyOne),
      toString,
    ),
    tree.fromDistinctAscArray(oneToThirtyOne.map(toString)),
  );
});

test('toArray', function () {
  assert.deepEqual(tree.toArray/*:: <mixed> */(tree.empty).sort(), []);
  assert.deepEqual(tree.toArray(tree.create(1)), [1]);
  assert.deepEqual(tree.toArray(tree.fromDistinctAscArray([1, 2, 3])), [1, 2, 3]);
  assert.deepEqual(tree.toArray(tree.fromDistinctAscArray([3, 2, 1])), [3, 2, 1]);
});

test('union', function () {
  const compareValues = (
    a/*: {+v: number} */,
    b/*: {+v: number} */,
  )/*: number */ => compareIntegers(a.v, b.v);

  assert.equal(tree.union(tree.empty, tree.empty, compareIntegers), tree.empty);
  assert.deepEqual(
    tree.union(tree.create(1), tree.empty, compareIntegers),
    tree.create(1),
  );
  assert.deepEqual(
    tree.union(tree.empty, tree.create(1), compareIntegers),
    tree.create(1),
  );
  assert.ok(
    tree.equals(
      tree.union(
        tree.fromDistinctAscArray([1, 2, 3]),
        tree.fromDistinctAscArray([4, 5, 6]),
        compareIntegers,
      ),
      tree.fromDistinctAscArray([1, 2, 3, 4, 5, 6]),
    ),
  );
  assert.ok(
    tree.equals(
      tree.union(
        tree.fromDistinctAscArray([4, 5, 6]),
        tree.fromDistinctAscArray([1, 2, 3]),
        compareIntegers,
      ),
      tree.fromDistinctAscArray([1, 2, 3, 4, 5, 6]),
    ),
  );
  assert.ok(
    tree.equals(
      tree.union(
        tree.fromDistinctAscArray([2, 3]),
        tree.fromDistinctAscArray([1, 4]),
        compareIntegers,
      ),
      tree.fromDistinctAscArray([1, 2, 3, 4]),
    ),
  );
  assert.ok(
    tree.equals(
      tree.union(
        tree.fromDistinctAscArray([1, 4]),
        tree.fromDistinctAscArray([1, 2, 3]),
        compareIntegers,
      ),
      tree.fromDistinctAscArray([1, 2, 3, 4]),
    ),
  );
  assert.ok(
    tree.equals(
      tree.union(
        tree.fromDistinctAscArray([1, 2, 3]),
        tree.fromDistinctAscArray([1, 4]),
        compareIntegers,
      ),
      tree.fromDistinctAscArray([1, 2, 3, 4]),
    ),
  );
  assert.ok(
    tree.equals(
      tree.union(
        tree.fromDistinctAscArray(oneToThirtyOne),
        tree.fromDistinctAscArray(oneToThirtyOne),
        compareIntegers,
      ),
      tree.fromDistinctAscArray(oneToThirtyOne),
    ),
  );

  const v3a = {v: 3};
  const v3b = {v: 3};

  const unionWithDefaultConflictHandler = tree.union(
    tree.fromDistinctAscArray([{v: 1}, {v: 2}, v3a]),
    tree.fromDistinctAscArray([v3b, {v: 4}, {v: 5}]),
    compareValues,
  );
  assert.deepEqual(
    tree.toArray(
      unionWithDefaultConflictHandler,
    ),
    [{v: 1}, {v: 2}, {v: 3}, {v: 4}, {v: 5}],
  );
  assert.equal(
    tree.find(unionWithDefaultConflictHandler, {v: 3}, compareValues, null),
    v3b,
  );

  const unionWithCustomConflictHandler = tree.union(
    tree.fromDistinctAscArray([{v: 1}, {v: 2}, v3a]),
    tree.fromDistinctAscArray([v3b, {v: 4}, {v: 5}]),
    compareValues,
    (v1, v2) => v1,
  );
  assert.deepEqual(
    tree.toArray(
      unionWithCustomConflictHandler,
    ),
    [{v: 1}, {v: 2}, {v: 3}, {v: 4}, {v: 5}],
  );
  assert.equal(
    tree.find(unionWithCustomConflictHandler, {v: 3}, compareValues, null),
    v3a,
  );

  assert.throws(
    function () {
      tree.union(
        tree.fromDistinctAscArray([1]),
        tree.fromDistinctAscArray([1]),
        compareIntegers,
        (v1, v2) => 2,
      );
    },
    ValueOrderError,
  );
});

test('zip', function () {
  assert.deepEqual(Array.from(tree.zip/*:: <mixed, mixed> */(tree.empty, tree.empty)), []);
  assert.deepEqual(Array.from(tree.zip/*:: <number, number> */(tree.create(1), tree.empty)), [[1, undefined]]);
  assert.deepEqual(Array.from(tree.zip/*:: <number, number> */(tree.empty, tree.create(1))), [[undefined, 1]]);
  assert.deepEqual(
    Array.from(
      tree.zip(
        tree.fromDistinctAscArray(['a', 'b', 'c']),
        tree.fromDistinctAscArray([1, 2, 3, undefined]),
      )
    ),
    [
      ['a', 1],
      ['b', 2],
      ['c', 3],
      [undefined, undefined],
    ],
  );
});

test('GHC issue #4242', function () {
  // https://gitlab.haskell.org/ghc/ghc/-/issues/4242

  let node/*: ImmutableTree<number> */ = tree.empty;
  for (const num of [0, 2, 5, 1, 6, 4, 8, 9, 7, 11, 10, 3]) {
    node = tree.insert(node, num, compareIntegers);
  }

  /*:: invariant(node.size !== 0); */

  node = tree.remove(node, tree.minValue(node), compareIntegers);

  assert.ok(checkTreeInvariants(node, compareIntegers));

  /*:: invariant(node.size !== 0); */

  node = tree.remove(node, tree.minValue(node), compareIntegers);

  assert.ok(checkTreeInvariants(node, compareIntegers));
});

test('indexOf', function () {
  let node = tree.fromDistinctAscArray(oneToThirtyOne);
  assert.equal(tree.indexOf(tree.empty, 1, compareIntegers), -1);
  assert.equal(tree.indexOf(node, 0, compareIntegers), -1);
  assert.equal(tree.indexOf(node, 32, compareIntegers), -1);
  assert.equal(
    tree.indexOf(
      {
        left: tree.empty,
        right: {
          left: tree.empty,
          right: tree.empty,
          value: 2,
          size: 1,
        },
        value: 1,
        size: 2,
      },
      2,
      compareIntegers,
    ),
    1,
  );
  for (const num of oneToThirtyOne) {
    assert.equal(tree.indexOf(node, num, compareIntegers), num - 1);
  }
  node = tree.fromDistinctAscArray(oneToThirtyOne.slice(0).reverse());
  for (const num of oneToThirtyOne) {
    assert.equal(tree.indexOf(node, num, compareIntegersReverse), 31 - num);
  }
});

test('at', function () {
  const node = tree.fromDistinctAscArray(oneToThirtyOne);
  /*:: invariant(node.size !== 0); */
  assert.throws(
    function () {
      tree.at(tree.create(1), 1);
    },
    IndexOutOfRangeError,
    'IndexOutOfRangeError exception is thrown for index 1 of size 1 tree',
  );
  assert.throws(
    function () {
      tree.at(tree.create(1), -2);
    },
    IndexOutOfRangeError,
    'IndexOutOfRangeError exception is thrown for index -2 of size 1 tree',
  );
  for (const num of oneToThirtyOne) {
    assert.equal(tree.at(node, num - 1), num);
    assert.equal(tree.at(node, -num), oneToThirtyOne.length - (num - 1));
  }
});

test('withKeyComparator', function () {
  const integerTree = withKeyComparator(
    compareIntegers,
    (x/*: number */) => x,
  );

  assert.ok(
    tree.equals(
      integerTree.difference(
        tree.fromDistinctAscArray([1, 2, 3]),
        tree.fromDistinctAscArray([2]),
      ),
      tree.fromDistinctAscArray([1, 3]),
    ),
  );

  let node = tree.fromDistinctAscArray(oneToThirtyOne);
  assert.equal(integerTree.find(node, 0), undefined);
  assert.equal(integerTree.find(node, 0, null), null);
  assert.equal(integerTree.find(node, 1), 1);

  assert.equal(integerTree.findNext(node, 31), undefined);
  assert.equal(integerTree.findNext(node, 31, null), null);
  assert.equal(integerTree.findNext(node, 1), 2);

  assert.equal(integerTree.findPrev(node, 1), undefined);
  assert.equal(integerTree.findPrev(node, 1, null), null);
  assert.equal(integerTree.findPrev(node, 31), 30);

  assert.equal(integerTree.indexOf(node, 0), -1);
  assert.equal(integerTree.indexOf(node, 1), 0);

  assert.throws(
    function () {
      node = integerTree.insert(node, 1);
    },
    ValueExistsError,
    'exception is thrown with insert',
  );
  node = integerTree.insert(node, 1, onConflictKeepTreeValue);
  node = integerTree.insert(node, 32, onConflictKeepTreeValue);
  node = integerTree.insertIfNotExists(node, 1);
  node = integerTree.insertIfNotExists(node, 33);
  node = integerTree.insertOrReplaceIfExists(node, 1);
  node = integerTree.insertOrReplaceIfExists(node, 34);
  assert.throws(
    function () {
      node = integerTree.insertOrThrowIfExists(node, 1);
    },
    ValueExistsError,
    'exception is thrown with insertOrThrowIfExists',
  );
  assert.equal(integerTree.find(node, 32), 32);
  assert.equal(integerTree.find(node, 33), 33);
  assert.equal(integerTree.find(node, 34), 34);

  node = integerTree.remove(node, 34);
  node = integerTree.removeIfExists(node, 33);
  node = integerTree.removeOrThrowIfNotExists(node, 32);
  assert.throws(
    function () {
      node = integerTree.removeOrThrowIfNotExists(node, 32);
    },
    ValueNotFoundError,
    'exception is thrown with removeOrThrowIfNotExists',
  );
  assert.equal(integerTree.find(node, 32), undefined);
  assert.equal(integerTree.find(node, 33), undefined);
  assert.equal(integerTree.find(node, 34), undefined);

  assert.ok(
    tree.equals(
      integerTree.union(
        tree.fromDistinctAscArray([1, 3, 5]),
        tree.fromDistinctAscArray([2, 4, 6]),
      ),
      tree.fromDistinctAscArray([1, 2, 3, 4, 5, 6]),
    ),
  );

  const num1 = new Number(1);
  // $FlowIgnore[incompatible-call]
  node = integerTree.update(node, num1, onConflictKeepTreeValue, onNotFoundThrowError);
  assert.equal(integerTree.find(node, 1), 1);
  // $FlowIgnore[incompatible-call]
  node = integerTree.update(node, num1, onConflictUseGivenValue, onNotFoundThrowError);
  // $FlowIgnore[incompatible-call]
  assert.equal(integerTree.find(node, 1), num1);
  assert.throws(
    function () {
      node = integerTree.update(node, 1, onConflictThrowError, onNotFoundThrowError);
    },
    ValueExistsError,
    'exception is thrown with update using onConflictThrowError',
  );
  node = integerTree.update(node, 32, onConflictThrowError, onNotFoundDoNothing);
  assert.equal(integerTree.find(node, 32), undefined);
  node = integerTree.update(node, 32, onConflictThrowError, onNotFoundUseGivenValue);
  assert.equal(integerTree.find(node, 32), 32);

  assert.ok(integerTree.validate(node).valid);
});

test('validate', function () {
  assert.ok(tree.validate(tree.empty, compareIntegers).valid, 'null tree is valid');
  assert.ok(tree.validate(tree.create(1), compareIntegers).valid, 'tree of size 1 is valid');

  let node/*: ImmutableTree<number> */ = {
    left: {
      left: tree.empty,
      right: tree.empty,
      value: 2,
      size: 1,
    },
    right: tree.empty,
    value: 1,
    size: 2,
  };
  let result = tree.validate(node, compareIntegers);
  assert.ok(!result.valid, 'tree is invalid');
  assert.equal(result.subtree, 'left');
  assert.equal(result.tree, node);

  node = {
    left: tree.empty,
    right: {
      left: tree.empty,
      right: tree.empty,
      value: 0,
      size: 1,
    },
    value: 1,
    size: 2,
  };
  result = tree.validate(node, compareIntegers);
  assert.ok(!result.valid, 'tree is invalid');
  assert.equal(result.subtree, 'right');
  assert.equal(result.tree, node);
});

test('setBalancingParameters', function () {
  assert.doesNotThrow(function () {
    tree.setBalancingParameters(3, 2);
  });
});

test('empty', function () {
  const empty = tree.empty;
  assert.equal(empty.size, 0, 'empty has size 0');
  assert.equal(empty.left, empty, 'empty left node is empty');
  assert.equal(empty.right, empty, 'empty right node is empty');
  assert.equal(empty.value, undefined, 'empty has undefined value');
  assert.ok(Object.isFrozen(empty), 'empty is frozen');
});
