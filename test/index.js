// @flow strict

import test from 'tape';

import checkTreeInvariants from './checkTreeInvariants.js';
import compareIntegers from './compareIntegers.js';
import {
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
import withComparator from '../src/withComparator.js';
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

test('all', function (t) {
  const thirtyOneToOne = oneToThirtyOne.slice(0).reverse();

  const numbers = oneToThirtyOne.slice(0);

  for (let i = 0; i < 5; i++) {
    let node/*: ImmutableTree<number> | null */ = null;

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
      const next = tree.findNext(node, num, compareIntegers, -1);
      t.equal(
        next,
        num < 31 ? (num + 1) : -1,
        'next node is found',
      );

      const prev = tree.findPrev(node, num, compareIntegers, -1);
      t.equal(
        prev,
        num > 1 ? (num - 1) : -1,
        'prev node is found',
      );
    }

    for (const num of numbers) {
      let foundValue = tree.find(node, num, compareIntegers, null);
      t.ok(foundValue === num, 'existing node is found');

      node = tree.remove(node, num, compareIntegers);
      t.ok(checkTreeInvariants(node, compareIntegers), 'tree is valid and balanced');

      foundValue = tree.find(node, num, compareIntegers, -1);
      t.ok(foundValue === -1, 'removed node is not found');
    }

    t.ok(node === null, 'tree is empty');

    node = tree.remove(node, 0, compareIntegers);
    t.ok(node === null, 'tree is still empty');
  }

  t.end();
});

test('find/findBy with different value type', function (t) {
  const compareX2 = (
    x/*: string */,
    value/*: {+x: string} */,
  )/*: number */ => x.localeCompare(value.x);

  const xa = {x: 'a'};
  const xb = {x: 'b'};

  let node = null;
  node = tree.insert(node, xa, compareStringX);
  node = tree.insert(node, xb, compareStringX);

  let foundValue = tree.find(node, 'b', compareX2, null);
  t.ok(foundValue?.x === 'b')
  foundValue = tree.find(node, 'c', compareX2, {x: 'c'});
  t.ok(foundValue.x === 'c');

  foundValue = tree.findBy(node, (x) => compareX2('b', x), null);
  t.ok(foundValue?.x === 'b')
  foundValue = tree.findBy(node, (x) => compareX2('c', x), {x: 'c'});
  t.ok(foundValue.x === 'c');

  t.end();
});

test('findNext/findPrev with non-existent values', function (t) {
  let node = null;
  node = tree.insert(node, 1, compareIntegers);
  node = tree.insert(node, 3, compareIntegers);
  node = tree.insert(node, 5, compareIntegers);
  node = tree.insert(node, 7, compareIntegers);
  node = tree.insert(node, 9, compareIntegers);

  t.equal(tree.findNext(node, 0, compareIntegers, null), 1);
  t.equal(tree.findNext(node, 1, compareIntegers, null), 3);
  t.equal(tree.findNext(node, 2, compareIntegers, null), 3);
  t.equal(tree.findNext(node, 3, compareIntegers, null), 5);
  t.equal(tree.findNext(node, 4, compareIntegers, null), 5);
  t.equal(tree.findNext(node, 5, compareIntegers, null), 7);
  t.equal(tree.findNext(node, 6, compareIntegers, null), 7);
  t.equal(tree.findNext(node, 7, compareIntegers, null), 9);
  t.equal(tree.findNext(node, 8, compareIntegers, null), 9);
  t.equal(tree.findNext(node, 9, compareIntegers, null), null);

  t.equal(tree.findPrev(node, 1, compareIntegers, null), null);
  t.equal(tree.findPrev(node, 2, compareIntegers, null), 1);
  t.equal(tree.findPrev(node, 3, compareIntegers, null), 1);
  t.equal(tree.findPrev(node, 4, compareIntegers, null), 3);
  t.equal(tree.findPrev(node, 5, compareIntegers, null), 3);
  t.equal(tree.findPrev(node, 6, compareIntegers, null), 5);
  t.equal(tree.findPrev(node, 7, compareIntegers, null), 5);
  t.equal(tree.findPrev(node, 8, compareIntegers, null), 7);
  t.equal(tree.findPrev(node, 9, compareIntegers, null), 7);
  t.equal(tree.findPrev(node, 10, compareIntegers, null), 9);

  t.end();
});

test('insertIfNotExists', function (t) {
  const cmp = (
    a/*: {+value: number} */,
    b/*: {+value: number} */,
  )/*: number */ => compareIntegers(a.value, b.value);

  let node/*: ImmutableTree<{+value: number}> | null */ = null;
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
  const cmp = (
    a/*: {+value: number} */,
    b/*: {+value: number} */,
  )/*: number */ => compareIntegers(a.value, b.value);

  let node/*: ImmutableTree<{+value: number}> | null */ = null;
  for (const num of oneToThirtyOne) {
    node = tree.insert(node, {value: num}, cmp, onConflictUseGivenValue);
    checkTreeInvariants(node, cmp);
  }

  for (const num of oneToThirtyOne) {
    const newValue1 = {value: num};
    const newNode1 = tree.insert(node, newValue1, cmp, onConflictUseGivenValue);
    checkTreeInvariants(newNode1, cmp);
    t.notEqual(node, newNode1);
    t.equal(tree.find(newNode1, {value: num}, cmp, null), newValue1);
  }

  for (const num of oneToThirtyOne) {
    const newValue2 = {value: num};
    const newNode2 = tree.insertOrReplaceIfExists(node, newValue2, cmp);
    checkTreeInvariants(newNode2, cmp);
    t.notEqual(node, newNode2);
    t.equal(tree.find(newNode2, {value: num}, cmp, null), newValue2);
  }

  t.equal(node?.size, 31);
  t.end();
});

test('insertOrThrowIfExists', function (t) {
  const cmp = (
    a/*: {+value: number} */,
    b/*: {+value: number} */,
  )/*: number */ => compareIntegers(a.value, b.value);

  let node/*: ImmutableTree<{+value: number}> | null */ = null;
  for (const num of oneToThirtyOne) {
    node = tree.insert(node, {value: num}, cmp);
    t.throws(
      function () {
        node = tree.insertOrThrowIfExists(node, {value: num}, cmp);
      },
      ValueExistsError,
      'exception is thrown with insertOrThrowIfExists',
    );
    t.throws(
      function () {
        node = tree.insert(node, {value: num}, cmp, onConflictThrowError);
      },
      ValueExistsError,
      'exception is thrown with insert plus onConflictThrowError',
    );
    t.throws(
      function () {
        node = tree.insert(node, {value: num}, cmp);
      },
      ValueExistsError,
      'exception is thrown with insert by default',
    );
  }

  t.equal(node?.size, 31);
  t.end();
});

test('replacing a node preserves the existing node size', function (t) {
  t.equal(
    tree.insertOrReplaceIfExists(
      {
        left: null,
        right: {
          left: null,
          right: null,
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
  t.end();
});

test('removeIfExists', function (t) {
  let node/*: ImmutableTree<number> | null */ = tree.create(1);
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
    checkTreeInvariants(node, compareIntegers);
    t.equal(tree.find(node, num, compareIntegers, null), null);
    t.equal((node?.size ?? 0), --size);
  }

  t.end();
});

test('removeOrThrowIfNotExists', function (t) {
  let node/*: ImmutableTree<number> | null */ = tree.create(1);
  t.throws(
    function () {
      node = tree.removeOrThrowIfNotExists(node, 2, compareIntegers);
    },
    ValueNotFoundError,
    'exception is thrown with removeOrThrowIfNotExists',
  );
  t.equal(node?.size, 1);
  node = tree.removeOrThrowIfNotExists(node, 1, compareIntegers);
  t.equal(node, null);

  t.end();
});

test('remove returns the same tree back if there is no value to remove', function (t) {
  let node/*: ImmutableTree<number> | null */ = null;
  for (const num of oneToThirtyOne) {
    node = tree.insert(node, num, compareIntegers);
  }

  const origNode = node;
  for (const num of oneToThirtyOne) {
    node = tree.remove(node, num + 31, compareIntegers);
    checkTreeInvariants(node, compareIntegers);
    t.equal(node, origNode);
  }
  for (const num of oneToThirtyOne) {
    node = tree.remove(node, num - 31, compareIntegers);
    checkTreeInvariants(node, compareIntegers);
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
  t.equal(tree.find(node, 1, cmpKeyWithItem, null), v1);
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
    ValueOrderError,
  );
  t.end();
});

test('update', function (t) {
  /*:: type Item = {+key: number, +value: number}; */

  const cmp = (a/*: Item */, b/*: Item */) => compareIntegers(a.key, b.key);
  const cmpKeyWithItem = (key/*: number */, item/*: Item */) => compareIntegers(key, item.key);

  const v1 = {key: 1, value: 10};
  const v2 = {key: 2, value: 20};

  let node/*: ImmutableTree<Item> | null */ = tree.create(v1);

  node = tree.update(
    node,
    v2,
    cmp,
    onConflictThrowError,
    (newItem) => {
      t.equal(newItem, v2);
      return v2;
    },
  );
  t.equal(tree.find(node, v2, cmp, null), v2);

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
  t.deepEqual(v3, {key: 3, value: 30});

  node = tree.update(
    node,
    3,
    cmpKeyWithItem,
    onConflictKeepTreeValue,
    (newKey) => {
      return {key: newKey, value: newKey * 10};
    },
  );
  t.deepEqual(
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
  t.deepEqual(
    tree.find(node, 3, cmpKeyWithItem, null),
    v3,
    'new tree value is used',
  );

  t.throws(
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

  t.throws(
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
  t.end();
});

test('onNotFoundDoNothing', function (t) {
  let node = tree.create(1);

  const newNode = tree.update(
    node,
    2,
    compareIntegers,
    onConflictThrowError,
    onNotFoundDoNothing,
  );
  t.equals(newNode, node, 'tree was not updated with onNotFoundDoNothing');
  t.end();
});

test('onNotFoundThrowError', function (t) {
  t.throws(
    () => {
      const node = tree.update/*:: <number, number> */(
        null,
        1,
        compareIntegers,
        onConflictKeepTreeValue,
        onNotFoundThrowError,
      );
    },
    ValueNotFoundError,
  );
  t.end();
});

test('onNotFoundUseGivenValue', function (t) {
  const node = tree.update/*:: <number, number> */(
    null,
    1,
    compareIntegers,
    onConflictKeepTreeValue,
    onNotFoundUseGivenValue,
  );
  t.equals(node?.value, 1);
  t.end();
});

test('difference', function (t) {
  t.equals(tree.difference(null, null, compareIntegers), null);
  t.deepEqual(
    tree.difference(tree.create(1), null, compareIntegers),
    tree.create(1),
  );
  t.deepEqual(
    tree.difference(null, tree.create(1), compareIntegers),
    null,
  );
  t.ok(
    tree.equals(
      tree.difference(
        tree.fromDistinctAscArray([1, 2, 3]),
        tree.fromDistinctAscArray([1, 2, 3]),
        compareIntegers,
      ),
      null,
    ),
  );
  t.ok(
    tree.equals(
      tree.difference(
        tree.fromDistinctAscArray([1, 2, 3, 4]),
        tree.fromDistinctAscArray([2, 3, 4, 5]),
        compareIntegers,
      ),
      tree.create(1),
    ),
  );
  t.ok(
    tree.equals(
      tree.difference(
        tree.fromDistinctAscArray([2, 3, 4, 5]),
        tree.fromDistinctAscArray([1, 2, 3, 4]),
        compareIntegers,
      ),
      tree.create(5),
    ),
  );
  t.ok(
    tree.equals(
      tree.difference(
        tree.fromDistinctAscArray([1, 4]),
        tree.fromDistinctAscArray([1, 2, 3]),
        compareIntegers,
      ),
      tree.create(4),
    ),
  );
  t.ok(
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
  t.ok(
    tree.equals(
      tree.difference(
        tree.fromDistinctAscArray(oneToThirtyOne),
        oneToThirtyOneOdds,
        compareIntegers,
      ),
      oneToThirtyOneEvens,
    ),
  );
  t.ok(
    tree.equals(
      tree.difference(
        tree.fromDistinctAscArray(oneToThirtyOne),
        oneToThirtyOneEvens,
        compareIntegers,
      ),
      oneToThirtyOneOdds,
    ),
  );

  t.end();
});


test('equals', function (t) {
  let tree1/*: ImmutableTree<number> | null */ = null;
  for (const num of oneToThirtyOne) {
    tree1 = tree.insert(tree1, num, compareIntegers);
  }

  let tree2/*: ImmutableTree<number> | null */ = null;
  for (const num of oneToThirtyOne.slice(0).reverse()) {
    tree2 = tree.insert(tree2, num, compareIntegers);
  }

  t.ok(tree.equals(tree1, tree2));

  tree1 = tree.remove(tree1, 1, compareIntegers);
  t.ok(!tree.equals(tree1, tree2));

  tree2 = tree.remove(tree2, 1, compareIntegers);
  t.ok(tree.equals(tree1, tree2));

  t.ok(tree.equals(null, null));
  t.ok(!tree.equals(tree1, null));
  t.ok(!tree.equals(null, tree1));

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
    (a, b) => objectIs(a.num, b.num),
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
    (a, b) => objectIs(a.num, b.num),
  ));

  t.end();
});

test('fromDistinctAscArray', function (t) {
  const node = tree.fromDistinctAscArray(oneToThirtyOne);
  t.ok(checkTreeInvariants(node, compareIntegers), 'tree is valid and balanced');
  t.end();
});

test('map', function (t) {
  const toString = (x/*: mixed */)/*: string */ => String(x);

  t.equals(tree.map(null, toString), null);
  t.deepEqual(
    tree.map(
      tree.fromDistinctAscArray(oneToThirtyOne),
      toString,
    ),
    tree.fromDistinctAscArray(oneToThirtyOne.map(toString)),
  );
  t.end();
});

test('toArray', function (t) {
  t.deepEqual(tree.toArray/*:: <mixed> */(null).sort(), []);
  t.deepEqual(tree.toArray(tree.create(1)), [1]);
  t.deepEqual(tree.toArray(tree.fromDistinctAscArray([1, 2, 3])), [1, 2, 3]);
  t.deepEqual(tree.toArray(tree.fromDistinctAscArray([3, 2, 1])), [3, 2, 1]);
  t.end();
});

test('union', function (t) {
  const compareValues = (
    a/*: {+v: number} */,
    b/*: {+v: number} */,
  )/*: number */ => compareIntegers(a.v, b.v);

  t.equals(tree.union(null, null, compareIntegers), null);
  t.deepEqual(
    tree.union(tree.create(1), null, compareIntegers),
    tree.create(1),
  );
  t.deepEqual(
    tree.union(null, tree.create(1), compareIntegers),
    tree.create(1),
  );
  t.ok(
    tree.equals(
      tree.union(
        tree.fromDistinctAscArray([1, 2, 3]),
        tree.fromDistinctAscArray([4, 5, 6]),
        compareIntegers,
      ),
      tree.fromDistinctAscArray([1, 2, 3, 4, 5, 6]),
    ),
  );
  t.ok(
    tree.equals(
      tree.union(
        tree.fromDistinctAscArray([4, 5, 6]),
        tree.fromDistinctAscArray([1, 2, 3]),
        compareIntegers,
      ),
      tree.fromDistinctAscArray([1, 2, 3, 4, 5, 6]),
    ),
  );
  t.ok(
    tree.equals(
      tree.union(
        tree.fromDistinctAscArray([2, 3]),
        tree.fromDistinctAscArray([1, 4]),
        compareIntegers,
      ),
      tree.fromDistinctAscArray([1, 2, 3, 4]),
    ),
  );
  t.ok(
    tree.equals(
      tree.union(
        tree.fromDistinctAscArray([1, 4]),
        tree.fromDistinctAscArray([1, 2, 3]),
        compareIntegers,
      ),
      tree.fromDistinctAscArray([1, 2, 3, 4]),
    ),
  );
  t.ok(
    tree.equals(
      tree.union(
        tree.fromDistinctAscArray([1, 2, 3]),
        tree.fromDistinctAscArray([1, 4]),
        compareIntegers,
      ),
      tree.fromDistinctAscArray([1, 2, 3, 4]),
    ),
  );
  t.ok(
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
  t.deepEqual(
    tree.toArray(
      unionWithDefaultConflictHandler,
    ),
    [{v: 1}, {v: 2}, {v: 3}, {v: 4}, {v: 5}],
  );
  t.equals(
    tree.find(unionWithDefaultConflictHandler, {v: 3}, compareValues, null),
    v3b,
  );

  const unionWithCustomConflictHandler = tree.union(
    tree.fromDistinctAscArray([{v: 1}, {v: 2}, v3a]),
    tree.fromDistinctAscArray([v3b, {v: 4}, {v: 5}]),
    compareValues,
    (v1, v2) => v1,
  );
  t.deepEqual(
    tree.toArray(
      unionWithCustomConflictHandler,
    ),
    [{v: 1}, {v: 2}, {v: 3}, {v: 4}, {v: 5}],
  );
  t.equals(
    tree.find(unionWithCustomConflictHandler, {v: 3}, compareValues, null),
    v3a,
  );

  t.throws(
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

  t.end();
});

test('zip', function (t) {
  t.deepEqual(Array.from(tree.zip/*:: <mixed, mixed> */(null, null)), []);
  t.deepEqual(Array.from(tree.zip/*:: <number, number> */(tree.create(1), null)), [[1, undefined]]);
  t.deepEqual(Array.from(tree.zip/*:: <number, number> */(null, tree.create(1))), [[undefined, 1]]);
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

  let node/*: ImmutableTree<number> | null */ = null;
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

test('indexOf', function (t) {
  let node = tree.fromDistinctAscArray(oneToThirtyOne);
  t.equals(tree.indexOf(null, 1, compareIntegers), -1);
  t.equals(tree.indexOf(node, 0, compareIntegers), -1);
  t.equals(tree.indexOf(node, 32, compareIntegers), -1);
  t.equals(
    tree.indexOf(
      {
        left: null,
        right: {
          left: null,
          right: null,
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
    t.equals(tree.indexOf(node, num, compareIntegers), num - 1);
  }
  node = tree.fromDistinctAscArray(oneToThirtyOne.slice(0).reverse());
  for (const num of oneToThirtyOne) {
    t.equals(tree.indexOf(node, num, compareIntegersReverse), 31 - num);
  }
  t.end();
});

test('at', function (t) {
  const node = tree.fromDistinctAscArray(oneToThirtyOne);
  /*:: invariant(node !== null); */
  t.throws(
    function () {
      tree.at(tree.create(1), 1);
    },
    IndexOutOfRangeError,
    'IndexOutOfRangeError exception is thrown for index 1 of size 1 tree',
  );
  t.throws(
    function () {
      tree.at(tree.create(1), -2);
    },
    IndexOutOfRangeError,
    'IndexOutOfRangeError exception is thrown for index -2 of size 1 tree',
  );
  for (const num of oneToThirtyOne) {
    t.equals(tree.at(node, num - 1), num);
    t.equals(tree.at(node, -num), oneToThirtyOne.length - (num - 1));
  }
  t.end();
});

test('withComparator', function (t) {
  const integerTree = withComparator(compareIntegers);

  t.ok(
    tree.equals(
      integerTree.difference(
        tree.fromDistinctAscArray([1, 2, 3]),
        tree.fromDistinctAscArray([2]),
      ),
      tree.fromDistinctAscArray([1, 3]),
    ),
  );

  let node = tree.fromDistinctAscArray(oneToThirtyOne);
  t.equals(integerTree.find(node, 0), undefined);
  t.equals(integerTree.find(node, 0, null), null);
  t.equals(integerTree.find(node, 1), 1);

  t.equals(integerTree.findNext(node, 31), undefined);
  t.equals(integerTree.findNext(node, 31, null), null);
  t.equals(integerTree.findNext(node, 1), 2);

  t.equals(integerTree.findPrev(node, 1), undefined);
  t.equals(integerTree.findPrev(node, 1, null), null);
  t.equals(integerTree.findPrev(node, 31), 30);

  t.equals(integerTree.indexOf(node, 0), -1);
  t.equals(integerTree.indexOf(node, 1), 0);

  t.throws(
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
  t.throws(
    function () {
      node = integerTree.insertOrThrowIfExists(node, 1);
    },
    ValueExistsError,
    'exception is thrown with insertOrThrowIfExists',
  );
  t.equals(integerTree.find(node, 32), 32);
  t.equals(integerTree.find(node, 33), 33);
  t.equals(integerTree.find(node, 34), 34);

  node = integerTree.remove(node, 34);
  node = integerTree.removeIfExists(node, 33);
  node = integerTree.removeOrThrowIfNotExists(node, 32);
  t.throws(
    function () {
      node = integerTree.removeOrThrowIfNotExists(node, 32);
    },
    ValueNotFoundError,
    'exception is thrown with removeOrThrowIfNotExists',
  );
  t.equals(integerTree.find(node, 32), undefined);
  t.equals(integerTree.find(node, 33), undefined);
  t.equals(integerTree.find(node, 34), undefined);

  t.ok(
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
  t.equals(integerTree.find(node, 1), 1);
  // $FlowIgnore[incompatible-call]
  node = integerTree.update(node, num1, onConflictUseGivenValue, onNotFoundThrowError);
  // $FlowIgnore[incompatible-call]
  t.equals(integerTree.find(node, 1), num1);
  t.throws(
    function () {
      node = integerTree.update(node, 1, onConflictThrowError, onNotFoundThrowError);
    },
    ValueExistsError,
    'exception is thrown with update using onConflictThrowError',
  );
  node = integerTree.update(node, 32, onConflictThrowError, onNotFoundDoNothing);
  t.equals(integerTree.find(node, 32), undefined);
  node = integerTree.update(node, 32, onConflictThrowError, onNotFoundUseGivenValue);
  t.equals(integerTree.find(node, 32), 32);

  t.ok(integerTree.validate(node).valid);

  t.end();
});

test('validate', function (t) {
  t.ok(tree.validate(null, compareIntegers).valid, 'null tree is valid');
  t.ok(tree.validate(tree.create(1), compareIntegers).valid, 'tree of size 1 is valid');

  let node/*: ImmutableTree<number> */ = {
    left: {
      left: null,
      right: null,
      value: 2,
      size: 1,
    },
    right: null,
    value: 1,
    size: 2,
  };
  let result = tree.validate(node, compareIntegers);
  t.ok(!result.valid, 'tree is invalid');
  t.equals(result.subtree, 'left');
  t.equals(result.tree, node);

  node = {
    left: null,
    right: {
      left: null,
      right: null,
      value: 0,
      size: 1,
    },
    value: 1,
    size: 2,
  };
  result = tree.validate(node, compareIntegers);
  t.ok(!result.valid, 'tree is invalid');
  t.equals(result.subtree, 'right');
  t.equals(result.tree, node);

  t.end();
});

test('setBalancingParameters', function (t) {
  t.doesNotThrow(function () {
    tree.setBalancingParameters(3, 2);
  });
  t.end();
});
