// @flow strict

import test from 'tape';

import checkTreeInvariants from './checkTreeInvariants.mjs';
import compareIntegers from './compareIntegers.mjs';
import * as tree from './index.mjs';
import {
  NOOP,
  REPLACE,
  THROW,
  insertByKey,
  onConflictKeepTreeValue,
  onConflictThrowError,
  onConflictUseGivenValue,
} from './insert.mjs';
import shuffle from './shuffle.mjs';
/*::
import invariant from './invariant.mjs';
*/

const oneToThirtyOne = [];

for (let i = 1; i <= 31; i++) {
  oneToThirtyOne.push(i);
}

test('all', function (t) {
  const thirtyOneToOne = oneToThirtyOne.slice(0).reverse();

  const numbers = oneToThirtyOne.slice(0);

  for (let i = 0; i < 5; i++) {
    let node = null;

    for (const num of numbers) {
      node = tree.insert(node, num, compareIntegers);
      t.ok(checkTreeInvariants(node, compareIntegers), 'tree is valid and balanced');
    }

    t.deepEqual(
      Array.from(tree.iterate(node)),
      oneToThirtyOne,
      'tree is in order',
    );

    t.deepEqual(
      Array.from(tree.reverseIterate(node)),
      thirtyOneToOne,
      'tree is in order (reversed)',
    );

    if (node !== null) {
      t.equal(tree.minNode(node).value, 1, 'min node value is 1');
      t.equal(tree.maxNode(node).value, 31, 'max node value is 31');
      t.equal(tree.minValue(node), 1, 'min value is 1');
      t.equal(tree.maxValue(node), 31, 'max value is 31');
    }

    shuffle(numbers);

    for (const num of numbers) {
      const next = tree.findNext(node, num, compareIntegers);
      t.equal(
        next === null ? null : next.value,
        num < 31 ? (num + 1) : null,
        'next node is found',
      );

      const prev = tree.findPrev(node, num, compareIntegers);
      t.equal(
        prev === null ? null : prev.value,
        num > 1 ? (num - 1) : null,
        'prev node is found',
      );
    }

    for (const num of numbers) {
      let foundNode = tree.find(node, num, compareIntegers);
      t.ok(foundNode !== null && foundNode.value === num, 'existing node is found');

      node = tree.remove(node, num, compareIntegers);
      t.ok(checkTreeInvariants(node, compareIntegers), 'tree is valid and balanced');

      foundNode = tree.find(node, num, compareIntegers);
      t.ok(foundNode === null, 'removed node is not found');
    }

    t.ok(node === null, 'tree is empty');

    node = tree.remove(node, 0, compareIntegers);
    t.ok(node === null, 'tree is still empty');
  }

  t.end();
});

test('onConflict export aliases', function (t) {
  t.equal(NOOP, onConflictKeepTreeValue);
  t.equal(REPLACE, onConflictUseGivenValue);
  t.equal(THROW, onConflictThrowError);
  t.equal(tree.NOOP, NOOP);
  t.equal(tree.REPLACE, REPLACE);
  t.equal(tree.THROW, THROW);
  t.end();
});

test('find with different value type', function (t) {
  const compareX = (a, b) => a.x.localeCompare(b.x);

  const xa = {x: 'a'};
  const xb = {x: 'b'};

  let node = null;
  node = tree.insert(node, xa, compareX);
  node = tree.insert(node, xb, compareX);

  const foundNode =
    tree.find(node, 'b', (x, value) => x.localeCompare(value.x));
  t.ok(foundNode !== null && foundNode.value.x === 'b')

  t.end();
});

test('findNext/findPrev with non-existent values', function (t) {
  let node = null;
  node = tree.insert(node, 1, compareIntegers);
  node = tree.insert(node, 3, compareIntegers);
  node = tree.insert(node, 5, compareIntegers);
  node = tree.insert(node, 7, compareIntegers);
  node = tree.insert(node, 9, compareIntegers);

  t.equal(tree.findNext(node, 0, compareIntegers)?.value, 1);
  t.equal(tree.findNext(node, 1, compareIntegers)?.value, 3);
  t.equal(tree.findNext(node, 2, compareIntegers)?.value, 3);
  t.equal(tree.findNext(node, 3, compareIntegers)?.value, 5);
  t.equal(tree.findNext(node, 4, compareIntegers)?.value, 5);
  t.equal(tree.findNext(node, 5, compareIntegers)?.value, 7);
  t.equal(tree.findNext(node, 6, compareIntegers)?.value, 7);
  t.equal(tree.findNext(node, 7, compareIntegers)?.value, 9);
  t.equal(tree.findNext(node, 8, compareIntegers)?.value, 9);
  t.equal(tree.findNext(node, 9, compareIntegers), null);

  t.equal(tree.findPrev(node, 1, compareIntegers), null);
  t.equal(tree.findPrev(node, 2, compareIntegers)?.value, 1);
  t.equal(tree.findPrev(node, 3, compareIntegers)?.value, 1);
  t.equal(tree.findPrev(node, 4, compareIntegers)?.value, 3);
  t.equal(tree.findPrev(node, 5, compareIntegers)?.value, 3);
  t.equal(tree.findPrev(node, 6, compareIntegers)?.value, 5);
  t.equal(tree.findPrev(node, 7, compareIntegers)?.value, 5);
  t.equal(tree.findPrev(node, 8, compareIntegers)?.value, 7);
  t.equal(tree.findPrev(node, 9, compareIntegers)?.value, 7);
  t.equal(tree.findPrev(node, 10, compareIntegers)?.value, 9);

  t.end();
});

test('insertIfNotExists', function (t) {
  const cmp = (a, b) => compareIntegers(a.value, b.value);

  let node = null;
  for (const num of oneToThirtyOne) {
    node = tree.insert(node, {value: num}, cmp, onConflictKeepTreeValue);

    const sameNode1 = tree.insert(node, {value: num}, cmp, onConflictKeepTreeValue);
    t.equal(node, sameNode1);

    const sameNode2 = tree.insertIfNotExists(node, {value: num}, cmp);
    t.equal(node, sameNode2);
  }

  const finalNode = node;
  for (const num of oneToThirtyOne) {
    node = tree.insert(node, {value: num}, cmp, onConflictKeepTreeValue);
    node = tree.insertIfNotExists(node, {value: num}, cmp);
  }
  t.equal(node, finalNode);

  t.equal(node?.size, 31);
  t.end();
});

test('insertOrReplaceIfExists', function (t) {
  const cmp = (a, b) => compareIntegers(a.value, b.value);

  let node = null;
  for (const num of oneToThirtyOne) {
    node = tree.insert(node, {value: num}, cmp, onConflictUseGivenValue);

    const newValue1 = {value: num};
    const newNode1 = tree.insert(node, newValue1, cmp, onConflictUseGivenValue);
    t.notEqual(node, newNode1);
    t.equal(tree.find(newNode1, {value: num}, cmp)?.value, newValue1);

    const newValue2 = {value: num};
    const newNode2 = tree.insertOrReplaceIfExists(node, newValue2, cmp);
    t.notEqual(node, newNode2);
    t.equal(tree.find(newNode2, {value: num}, cmp)?.value, newValue2);
  }

  t.equal(node?.size, 31);
  t.end();
});

test('insertOrThrowIfExists', function (t) {
  const cmp = (a, b) => compareIntegers(a.value, b.value);

  let node = null;
  for (const num of oneToThirtyOne) {
    node = tree.insert(node, {value: num}, cmp);
    t.throws(
      function () {
        node = tree.insertOrThrowIfExists(node, {value: num}, cmp);
      },
      /^Error: The value given to insert already exists in the tree\.$/,
      'exception is thrown with insertOrThrowIfExists',
    );
    t.throws(
      function () {
        node = tree.insert(node, {value: num}, cmp, onConflictThrowError);
      },
      /^Error: The value given to insert already exists in the tree\.$/,
      'exception is thrown with insert plus onConflictThrowError',
    );
    t.throws(
      function () {
        node = tree.insert(node, {value: num}, cmp);
      },
      /^Error: The value given to insert already exists in the tree\.$/,
      'exception is thrown with insert by default',
    );
  }

  t.equal(node?.size, 31);
  t.end();
});

test('removeIfExists', function (t) {
  let node = tree.create(1);
  node = tree.insert(node, 2, compareIntegers);

  const origNode = node;
  node = tree.removeIfExists(node, 3, compareIntegers);
  t.equal(node, origNode);
  node = tree.remove(node, 3, compareIntegers);
  t.equal(node, origNode);
  const node2 = tree.removeIfExists(node, 2, compareIntegers);
  t.equal(node2?.size, 1);
  t.equal(node2?.value, 1);
  const node3 = tree.remove(node, 2, compareIntegers);
  t.equal(node3?.size, 1);
  t.equal(node3?.value, 1);
  const node4 = tree.removeIfExists(node2, 1, compareIntegers);
  t.equal(node4, null);
  const node5 = tree.remove(node3, 1, compareIntegers);
  t.equal(node5, null);
  const node6 = tree.removeIfExists(null, 1, compareIntegers);
  t.equal(node6, null);
  const node7 = tree.remove(null, 1, compareIntegers);
  t.equal(node7, null);

  node = tree.fromDistinctAscArray(oneToThirtyOne);

  let size = 31;
  for (const num of oneToThirtyOne) {
    node = tree.removeIfExists(node, num, compareIntegers);
    t.equal(tree.find(node, num, compareIntegers), null);
    t.equal((node?.size ?? 0), --size);
  }

  t.end();
});

test('removeOrThrowIfNotExists', function (t) {
  let node = tree.create(1);
  t.throws(
    function () {
      node = tree.removeOrThrowIfNotExists(node, 2, compareIntegers);
    },
    /^Error: The value given to remove does not exist in the tree\.$/,
    'exception is thrown with removeOrThrowIfNotExists',
  );
  t.equal(node?.size, 1);
  node = tree.removeOrThrowIfNotExists(node, 1, compareIntegers);
  t.equal(node, null);

  t.end();
});

test('remove returns the same tree back if there is no value to remove', function (t) {
  let node = null;
  for (const num of oneToThirtyOne) {
    node = tree.insert(node, num, compareIntegers);
  }

  const origNode = node;
  for (const num of oneToThirtyOne) {
    node = tree.remove(node, num + 31, compareIntegers);
    t.equal(node, origNode);
  }
  for (const num of oneToThirtyOne) {
    node = tree.remove(node, num - 31, compareIntegers);
    t.equal(node, origNode);
  }

  t.end();
});

test('create', function (t) {
  const node = tree.create(1);
  t.deepEqual(node, {
    left: null,
    right: null,
    size: 1,
    value: 1,
  });
  t.end();
});

test('insert with onConflict', function (t) {
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
      t.equal(treeValue, v1);
      t.deepEqual(newValue, {key: 1, value: 100});
      v1 = {key: 1, value: 1000};
      return v1;
    },
  );
  t.equal(tree.find(node, 1, cmpKeyWithItem)?.value, v1);
  t.deepEqual(v1, {key: 1, value: 1000});

  t.throws(
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
    /^Error: The relative ordering of the value to insert has changed\.$/,
  );
  t.end();
});

test('insertByKey', function (t) {
  /*:: type Item = {+key: number, +value: number}; */

  const cmp = (a/*: Item */, b/*: Item */) => compareIntegers(a.key, b.key);
  const cmpKeyWithItem = (key/*: number */, item/*: Item */) => compareIntegers(key, item.key);

  const v1 = {key: 1, value: 10};
  const v2 = {key: 2, value: 20};

  let node = tree.create(v1);

  node = insertByKey(
    node,
    v2,
    cmp,
    onConflictThrowError,
    (newItem) => {
      t.equal(newItem, v2);
      return v2;
    },
  );
  t.equal(tree.find(node, v2, cmp)?.value, v2);

  node = insertByKey(
    node,
    3,
    cmpKeyWithItem,
    onConflictThrowError,
    (newKey) => {
      return {key: newKey, value: newKey * 10};
    },
  );
  let v3 = tree.find(node, 3, cmpKeyWithItem)?.value;
  t.deepEqual(v3, {key: 3, value: 30});

  node = insertByKey(
    node,
    3,
    cmpKeyWithItem,
    onConflictKeepTreeValue,
    (newKey) => {
      return {key: newKey, value: newKey * 10};
    },
  );
  t.deepEqual(
    tree.find(node, 3, cmpKeyWithItem)?.value,
    v3,
    'existing tree value it kept',
  );

  node = insertByKey(
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
  t.deepEqual(
    tree.find(node, 3, cmpKeyWithItem)?.value,
    v3,
    'new tree value is used',
  );

  t.throws(
    function () {
      node = insertByKey(
        node,
        {key: 4, value: 40},
        cmp,
        onConflictKeepTreeValue,
        (newValue) => {
          return {key: 5, value: 50};
        },
      );
    },
    /^Error: The relative ordering of the value to insert has changed\.$/,
  );
  t.end();
});

test('equals', function (t) {
  let tree1 = null;
  for (const num of oneToThirtyOne) {
    tree1 = tree.insert(tree1, num, compareIntegers);
  }

  let tree2 = null;
  for (const num of oneToThirtyOne.slice(0).reverse()) {
    tree2 = tree.insert(tree2, num, compareIntegers);
  }

  t.ok(tree.equals(tree1, tree2, compareIntegers));

  tree1 = tree.remove(tree1, 1, compareIntegers);
  t.ok(!tree.equals(tree1, tree2, compareIntegers));

  tree2 = tree.remove(tree2, 1, compareIntegers);
  t.ok(tree.equals(tree1, tree2, compareIntegers));

  t.ok(tree.equals(null, null, compareIntegers));
  t.ok(!tree.equals(tree1, null, compareIntegers));
  t.ok(!tree.equals(null, tree1, compareIntegers));

  t.ok(tree.equals(
    {
      left: {
        left: null,
        right: null,
        size: 1,
        value: {num: 1},
      },
      right: null,
      size: 2,
      value: {num: 2},
    },
    {
      left: null,
      right: {
        left: null,
        right: null,
        size: 1,
        value: {num: 2},
      },
      size: 2,
      value: {num: 1},
    },
    (a, b) => compareIntegers(a.num, b.num),
  ));

  t.ok(!tree.equals(
    {
      left: {
        left: null,
        right: null,
        size: 1,
        value: {num: 1},
      },
      right: {
        left: null,
        right: null,
        size: 1,
        value: {num: 3},
      },
      size: 2,
      value: {num: 2},
    },
    {
      left: {
        left: null,
        right: null,
        size: 1,
        value: {num: 0},
      },
      right: {
        left: null,
        right: null,
        size: 1,
        value: {num: 2},
      },
      size: 2,
      value: {num: 1},
    },
    (a, b) => compareIntegers(a.num, b.num),
  ));

  t.end();
});

test('fromDistinctAscArray', function (t) {
  const node = tree.fromDistinctAscArray(oneToThirtyOne);
  t.ok(checkTreeInvariants(node, compareIntegers), 'tree is valid and balanced');
  t.end();
});

test('zip', function (t) {
  t.deepEqual(Array.from(tree.zip(null, null)), []);
  t.deepEqual(Array.from(tree.zip(tree.create(1), null)), [[1, undefined]]);
  t.deepEqual(Array.from(tree.zip(null, tree.create(1))), [[undefined, 1]]);
  t.deepEqual(
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
  t.end();
});

test('GHC issue #4242', function (t) {
  // https://gitlab.haskell.org/ghc/ghc/-/issues/4242

  let node = null;
  for (const num of [0, 2, 5, 1, 6, 4, 8, 9, 7, 11, 10, 3]) {
    node = tree.insert(node, num, compareIntegers);
  }

  /*:: invariant(node !== null); */

  node = tree.remove(node, tree.minValue(node), compareIntegers);

  t.ok(checkTreeInvariants(node, compareIntegers));

  /*:: invariant(node !== null); */

  node = tree.remove(node, tree.minValue(node), compareIntegers);

  t.ok(checkTreeInvariants(node, compareIntegers));

  t.end();
});
