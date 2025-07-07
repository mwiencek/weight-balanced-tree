// @flow strict

import assert from 'node:assert/strict';
// $FlowIssue[cannot-resolve-module]
import test from 'node:test';

import checkTreeInvariants from './checkTreeInvariants.js';
import compareIntegers from './compareIntegers.js';
import {
  balanceLeft,
  balanceRight,
} from '../src/balance.js';
import {node as newNode} from '../src/create.js';
import {
  EmptyTreeError,
  ValueExistsError,
  ValueNotFoundError,
} from '../src/errors.js';
import * as tree from '../src/index.js';
import {
  onConflictKeepTreeValue,
  onConflictThrowError,
  onConflictUseGivenValue,
  onConflictRemoveValue,
  onNotFoundDoNothing,
  onNotFoundThrowError,
  onNotFoundUseGivenValue,
} from '../src/update.js';
import withKeyComparator from '../src/withKeyComparator.js';
/*::
import invariant from '../src/invariant.js';
import type {ImmutableTree} from '../src/types.js';
*/

/*::
type KeyedObject = {+key: number, ...};
*/

const compareObjectKeys = (
  a/*: KeyedObject */,
  b/*: KeyedObject */,
)/*: number */ => compareIntegers(a.key, b.key);

const compareNumberWithObjectKey = (
  num/*: number */,
  numValueObj/*: KeyedObject */,
)/*: number */ => compareIntegers(num, numValueObj.key);

const compareIntegersReverse = (
  a/*: number */,
  b/*: number */,
)/*: number */ => compareIntegers(b, a);

// $FlowIssue[method-unbinding]
const objectIs/*: <T>(a: T, b: T) => boolean */ = Object.is;

const buildAscIntegerArray = (start/*: number */, stop/*: number */) => {
  const ints = [];
  for (let i = start; i <= stop; i++) {
    ints.push(i);
  }
  return ints;
};

const buildAscIntegerTree = (start/*: number */, stop/*: number */) => (
  tree.fromDistinctAscArray(buildAscIntegerArray(start, stop))
);

const oneToThirtyOne = buildAscIntegerArray(1, 31);
const oneToThirtyOneTree = tree.fromDistinctAscArray(oneToThirtyOne);
const oneToThirtyOneKeyTree/*: ImmutableTree<KeyedObject> */ =
  tree.fromDistinctAscArray(oneToThirtyOne.map(key => ({key})));

test('at', function () {
  const node = oneToThirtyOneTree;
  /*:: invariant(node.size !== 0); */
  assert.equal(tree.at(tree.create(1), 1), undefined);
  assert.equal(tree.at(tree.create(1), -2, null), null);
  for (const num of oneToThirtyOne) {
    assert.equal(tree.at(node, num - 1), num);
    assert.equal(tree.at(node, -num), oneToThirtyOne.length - (num - 1));
  }
});

test('balanceLeft', function () {
  const node = newNode(
    newNode(
      newNode(
        newNode(tree.empty, 1599, tree.create(1605)),
        1656,
        newNode(tree.create(1688), 1706, tree.create(1713)),
      ),
      1760,
      newNode(tree.create(1761), 1766, tree.create(1796)),
    ),
    1824,
    newNode(tree.create(1892), 1904, tree.create(1914)),
  );

  balanceLeft(node);
  assert.ok(checkTreeInvariants(node, compareIntegers));

  assert.deepEqual(node, newNode(
    newNode(
      newNode(tree.empty, 1599, tree.create(1605)),
      1656,
      newNode(tree.create(1688), 1706, tree.create(1713)),
    ),
    1760,
    newNode(
      newNode(tree.create(1761), 1766, tree.create(1796)),
      1824,
      newNode(tree.create(1892), 1904, tree.create(1914)),
    ),
  ));
});

test('balanceRight', function () {
  const node = newNode(
    newNode(tree.create(-1235), -1206, tree.create(-1179)),
    -1162,
    newNode(
      newNode(tree.create(-1153), -1142, tree.create(-1139)),
      -1133,
      newNode(
        newNode(tree.empty, -1125, tree.create(-977)),
        -963,
        newNode(tree.create(-893), -878, tree.create(-870)),
      ),
    ),
  );

  balanceRight(node);
  assert.ok(checkTreeInvariants(node, compareIntegers));

  assert.deepEqual(node, newNode(
    newNode(
      newNode(tree.create(-1235), -1206, tree.create(-1179)),
      -1162,
      newNode(tree.create(-1153), -1142, tree.create(-1139)),
    ),
    -1133,
    newNode(
      newNode(tree.empty, -1125, tree.create(-977)),
      -963,
      newNode(tree.create(-893), -878, tree.create(-870)),
    ),
  ));
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

test('difference', function (t) {
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
        oneToThirtyOneTree,
        oneToThirtyOneOdds,
        compareIntegers,
      ),
      oneToThirtyOneEvens,
    ),
  );
  assert.ok(
    tree.equals(
      tree.difference(
        oneToThirtyOneTree,
        oneToThirtyOneEvens,
        compareIntegers,
      ),
      oneToThirtyOneOdds,
    ),
  );

  t.test('left node reference is reused', () => {
    const leftNode = newNode(tree.empty, 0, tree.empty);
    assert.equal(
      tree.difference(
        newNode(leftNode, 1, tree.empty),
        tree.create(1),
        compareIntegers,
      ),
      leftNode,
    );
  });

  t.test('right node reference is reused', () => {
    const rightNode = newNode(tree.empty, 1, tree.empty);
    assert.equal(
      tree.difference(
        newNode(tree.empty, 0, rightNode),
        tree.create(0),
        compareIntegers,
      ),
      rightNode,
    );
  });

  t.test('entire left tree is reused', () => {
    assert.equal(tree.difference(oneToThirtyOneTree, tree.create(0), compareIntegers), oneToThirtyOneTree);
    assert.equal(tree.difference(oneToThirtyOneTree, tree.create(32), compareIntegers), oneToThirtyOneTree);
  });
});

test('empty', function () {
  const empty = tree.empty;
  assert.equal(empty.size, 0, 'empty has size 0');
  assert.equal(empty.left, null, 'empty left node is null');
  assert.equal(empty.right, null, 'empty right node is null');
  assert.equal(empty.value, null, 'empty has null value');
  assert.ok(Object.isFrozen(empty), 'empty is frozen');
});

test('equals', function () {
  let tree1 = oneToThirtyOneTree;

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
    newNode(tree.create({num: 1}), {num: 2}, tree.empty),
    newNode(tree.empty, {num: 1}, tree.create({num: 2})),
    (a, b) => objectIs(a.num, b.num),
  ));

  assert.ok(!tree.equals(
    newNode(tree.create({num: 1}), {num: 2}, tree.create({num: 3})),
    newNode(tree.create({num: 0}), {num: 1}, tree.create({num: 2})),
    (a, b) => objectIs(a.num, b.num),
  ));
});

test('filter', function (t) {
  const predicate = (x/*: number */) => x > 5 && x < 10;
  assert.equal(tree.filter(tree.empty, predicate), tree.empty);
  assert.ok(
    tree.equals(
      tree.filter(oneToThirtyOneTree, predicate),
      tree.fromDistinctAscArray([6, 7, 8, 9]),
    ),
  );
  assert.equal(
    tree.filter(oneToThirtyOneTree, (x/*: number */) => x > 0),
    oneToThirtyOneTree,
  );

  t.test('left node reference is reused', () => {
    const leftNode = newNode(tree.empty, 0, tree.empty);
    assert.equal(
      tree.filter(
        newNode(leftNode, 1, tree.empty),
        (x/*: number */) => x < 1,
      ),
      leftNode,
    );
  });

  t.test('right node reference is reused', () => {
    const rightNode = newNode(tree.empty, 1, tree.empty);
    assert.equal(
      tree.filter(
        newNode(tree.empty, 0, rightNode),
        (x/*: number */) => x > 0,
      ),
      rightNode,
    );
  });

  t.test('entire tree is reused', () => {
    assert.equal(tree.filter(oneToThirtyOneTree, Boolean), oneToThirtyOneTree);
  });
});

test('find', function () {
  const node = oneToThirtyOneKeyTree;
  let foundValue;

  for (const num of oneToThirtyOne) {
    let foundValue = tree.find(node, {key: num}, compareObjectKeys, null);
    assert.equal(foundValue?.key, num);
    foundValue = tree.find(node, num, compareNumberWithObjectKey, null);
    assert.equal(foundValue?.key, num);
  }

  foundValue = tree.find(node, {key: 32}, compareObjectKeys, null);
  assert.equal(foundValue, null);
  foundValue = tree.find(node, 32, compareNumberWithObjectKey, null);
  assert.equal(foundValue, null);
});

test('findAll', function () {
  let node = oneToThirtyOneKeyTree;
  let foundValues;

  foundValues = Array.from(
    tree.findAll(
      node,
      15,
      (key, obj) => (
        (obj.key < (key + 3) && obj.key > (key - 3))
          ? 0
          : (key - obj.key)
      ),
    ),
  );
  assert.deepEqual(
    foundValues,
    [{key: 13}, {key: 14}, {key: 15}, {key: 16}, {key: 17}],
  );

  const compareValueAndKey = (
    a/*: {+value: number, +key: number} */,
    b/*: {+value: number, +key: number} */,
  ) => compareIntegers(a.value, b.value) || compareObjectKeys(a, b);

  node = tree.fromDistinctAscArray([
    {value: 10, key: 1},
    {value: 20, key: 1},
    {value: 30, key: 1},
  ]);
  node = tree.insert(node, {value: 20, key: 2}, compareValueAndKey);
  node = tree.insert(node, {value: 20, key: 3}, compareValueAndKey);

  foundValues = Array.from(
    tree.findAll(node, 20, (value, obj) => compareIntegers(value, obj.value)),
  );
  assert.deepEqual(
    foundValues,
    [
      {value: 20, key: 1},
      {value: 20, key: 2},
      {value: 20, key: 3},
    ],
  );

  foundValues = Array.from(
    tree.findAll(node, 40, (value, obj) => compareIntegers(value, obj.value)),
  );
  assert.deepEqual(foundValues, []);
});

test('findBy', function () {
  const node = oneToThirtyOneKeyTree;
  let foundValue;

  for (const num of oneToThirtyOne) {
    let foundValue = tree.findBy(node, (obj) => compareIntegers(num, obj.key));
    assert.equal(foundValue?.key, num);
  }

  foundValue = tree.findBy/*:: <KeyedObject, string> */(node, (obj) => compareIntegers(32, obj.key), 'default');
  assert.equal(foundValue, 'default');
});

test('findNext', function () {
  const node = oneToThirtyOneKeyTree;

  for (const num of oneToThirtyOne) {
    const nextNum = num >= 31 ? undefined : (num + 1);

    let foundValue = tree.findNext(node, {key: num}, compareObjectKeys);
    assert.equal(foundValue?.key, nextNum);

    foundValue = tree.findNext(node, {key: num + 0.5}, compareObjectKeys);
    assert.equal(foundValue?.key, nextNum);

    foundValue = tree.findNext/*:: <KeyedObject, number, {+key: -1}> */(node, num, compareNumberWithObjectKey, {key: -1});
    assert.equal(foundValue.key, nextNum ?? -1);
  }
});

test('findPrev', function () {
  const node = oneToThirtyOneKeyTree;

  for (const num of oneToThirtyOne) {
    const nextNum = num <= 1 ? undefined : (num - 1);

    let foundValue = tree.findPrev(node, {key: num}, compareObjectKeys);
    assert.equal(foundValue?.key, nextNum);

    foundValue = tree.findPrev(node, {key: num - 0.5}, compareObjectKeys);
    assert.equal(foundValue?.key, nextNum);

    foundValue = tree.findPrev/*:: <KeyedObject, number, {+key: -1}> */(node, num, compareNumberWithObjectKey, {key: -1});
    assert.equal(foundValue.key, nextNum ?? -1);
  }
});

test('findWithIndex', function () {
  const node = oneToThirtyOneKeyTree;

  assert.deepEqual(tree.findWithIndex(tree.empty, {key: 1}, compareObjectKeys), [undefined, -1]);
  assert.deepEqual(tree.findWithIndex(node, {key: 0}, compareObjectKeys), [undefined, -1]);
  assert.deepEqual(tree.findWithIndex(node, {key: 32}, compareObjectKeys), [undefined, -1]);

  for (const num of oneToThirtyOne) {
    let [foundValue, foundIndex] = tree.findWithIndex(node, {key: num}, compareObjectKeys, null);
    assert.deepEqual([foundValue, foundIndex], [{key: num}, num - 1]);
    [foundValue, foundIndex] = tree.findWithIndex(node, num, compareNumberWithObjectKey, null);
    assert.deepEqual([foundValue, foundIndex], [{key: num}, num - 1]);
  }

  let foundValue, foundIndex;
  [foundValue, foundIndex] = tree.findWithIndex(node, {key: 32}, compareObjectKeys, null);
  assert.deepEqual([foundValue, foundIndex], [null, -1]);
  [foundValue, foundIndex] = tree.findWithIndex(node, 32, compareNumberWithObjectKey, null);
  assert.deepEqual([foundValue, foundIndex], [null, -1]);
});

test('fromDistinctAscArray', function () {
  assert.equal(tree.fromDistinctAscArray([]), tree.empty);

  const node = oneToThirtyOneTree;
  assert.ok(checkTreeInvariants(node, compareIntegers), 'tree is valid and balanced');
});

test('indexOf', function () {
  let node = oneToThirtyOneTree;
  assert.equal(tree.indexOf(tree.empty, 1, compareIntegers), -1);
  assert.equal(tree.indexOf(node, 0, compareIntegers), -1);
  assert.equal(tree.indexOf(node, 32, compareIntegers), -1);
  assert.equal(
    tree.indexOf(
      newNode(tree.empty, 1, tree.create(2)),
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

test('insert', function (t) {
  t.test('basic insertions', function () {
    let node/*: ImmutableTree<KeyedObject> */ = tree.empty;

    let size = 0;
    for (const num of oneToThirtyOne) {
      assert.equal(node.size, size);
      node = tree.insert(node, {key: num}, compareObjectKeys);
      assert.equal(tree.find(node, {key: num}, compareObjectKeys)?.key, num);
      assert.equal(node.size, ++size);
    }
  });

  const v1/*: KeyedObject */ = {key: 1, value: 10};
  const v2/*: KeyedObject */ = {key: 1, value: 100};
  const v3/*: KeyedObject */ = {key: 1, value: 1000};
  const origNode = tree.create(v1);

  t.test('default onConflict behavior', function () {
    let node = origNode;
    assert.throws(
      function () {
        node = tree.insert(node, v2, compareObjectKeys);
      },
      ValueExistsError,
    );
    assert.equal(node, origNode);
    assert.equal(tree.find(node, 1, compareNumberWithObjectKey), v1);
  });

  t.test('onConflictKeepTreeValue', function () {
    let node/*: ImmutableTree<KeyedObject> */ = origNode;
    node = tree.insert(
      node,
      v2,
      compareObjectKeys,
      onConflictKeepTreeValue,
    );
    assert.equal(node, origNode);
    assert.equal(tree.find(node, 1, compareNumberWithObjectKey), v1);
  });

  t.test('onConflictUseGivenValue', function () {
    let node/*: ImmutableTree<KeyedObject> */ = origNode;
    node = tree.insert(
      node,
      v2,
      compareObjectKeys,
      onConflictUseGivenValue,
    );
    assert.notEqual(node, origNode);
    assert.equal(tree.find(node, 1, compareNumberWithObjectKey), v2);
  });

  t.test('onConflictThrowError', function () {
    let node/*: ImmutableTree<KeyedObject> */ = origNode;
    assert.throws(
      function () {
        node = tree.insert(
          node,
          v1,
          compareObjectKeys,
          onConflictThrowError,
        );
      },
      ValueExistsError,
    );
    assert.equal(node, origNode);
    assert.equal(tree.find(node, 1, compareNumberWithObjectKey), v1);
  });

  t.test('onConflictRemoveValue', function () {
    let node/*: ImmutableTree<KeyedObject> */ = origNode;
    node = tree.insert(
      node,
      v1,
      compareObjectKeys,
      onConflictRemoveValue,
    );
    assert.equal(node, tree.empty);
    assert.equal(tree.find(node, 1, compareNumberWithObjectKey), undefined);
  });

  t.test('custom onConflict return value', function () {
    let node/*: ImmutableTree<KeyedObject> */ = origNode;
    node = tree.insert(
      node,
      v1,
      compareObjectKeys,
      () => v3,
    );
    assert.notEqual(node, origNode);
    assert.equal(tree.find(node, 1, compareNumberWithObjectKey), v3);
  });

  t.test('custom onConflict return value with ValueOrderError', function () {
    assert.throws(
      function () {
        tree.insert(
          origNode,
          v1,
          compareObjectKeys,
          () => {
            return {key: 2, value: 20};
          },
        );
      },
      {
        name: 'ValueOrderError',
        message: 'The relative order of values has changed: ' +
          'expected [object Object] to be equal to [object Object]',
      },
    );
  });
});

test('insertIfNotExists', function () {
  let node/*: ImmutableTree<number> */ = tree.empty;
  for (const num of oneToThirtyOne) {
    node = tree.insertIfNotExists(node, num, compareIntegers);
  }

  const finalNode = node;
  assert.ok(tree.equals(finalNode, oneToThirtyOneTree));

  for (const num of oneToThirtyOne) {
    node = tree.insertIfNotExists(node, num, compareIntegers);
  }
  assert.equal(node, finalNode);
});

test('insertOrReplaceIfExists', function () {
  let node/*: ImmutableTree<KeyedObject> */ = tree.empty;
  for (const num of oneToThirtyOne) {
    node = tree.insertOrReplaceIfExists(node, {key: num}, compareObjectKeys);
  }

  const origNode = node;
  assert.ok(tree.equals(origNode, oneToThirtyOneKeyTree, (a, b) => a.key === b.key));

  for (const num of oneToThirtyOne) {
    const newValue = {key: num};
    const prevNode = node;
    node = tree.insertOrReplaceIfExists(node, newValue, compareObjectKeys);
    assert.notEqual(node, prevNode);
    assert.equal(node.size, prevNode.size);
    assert.equal(tree.find(node, newValue, compareObjectKeys, null), newValue);
  }
});

test('insertOrThrowIfExists', function () {
  let node/*: ImmutableTree<KeyedObject> */ = tree.empty;
  for (const num of oneToThirtyOne) {
    node = tree.insert(node, {key: num}, compareObjectKeys);
    assert.throws(
      function () {
        node = tree.insertOrThrowIfExists(node, {key: num}, compareObjectKeys);
      },
      ValueExistsError,
      'exception is thrown with insertOrThrowIfExists',
    );
  }

  assert.equal(node.size, 31);
});

test('intersection', function (t) {
  assert.equal(
    tree.intersection(tree.empty, tree.empty, compareIntegers),
    tree.empty,
  );
  assert.ok(
    tree.equals(
      tree.intersection(tree.create(1), tree.empty, compareIntegers),
      tree.empty,
    ),
  );
  assert.ok(
    tree.equals(
      tree.intersection(
        tree.fromDistinctAscArray([1, 2, 3, 4, 5]),
        tree.fromDistinctAscArray([3, 4, 5, 6, 7]),
        compareIntegers,
      ),
      tree.fromDistinctAscArray([3, 4, 5]),
    ),
  );
  assert.ok(
    tree.equals(
      tree.intersection(
        tree.fromDistinctAscArray(oneToThirtyOne),
        tree.fromDistinctAscArray(oneToThirtyOne),
        compareIntegers,
      ),
      oneToThirtyOneTree,
    ),
  );

  const k3a = {key: 3};
  const k3b = {key: 3};

  const intersectionWithDefaultCombiner = tree.intersection(
    tree.fromDistinctAscArray([k3a]),
    tree.fromDistinctAscArray([k3b]),
    compareObjectKeys,
  );
  assert.equal(
    intersectionWithDefaultCombiner.value,
    k3a,
  );

  const intersectionWithCustomCombiner = tree.intersection(
    tree.fromDistinctAscArray([k3a]),
    tree.fromDistinctAscArray([k3b]),
    compareObjectKeys,
    (v1) => v1,
  );
  assert.equal(
    intersectionWithCustomCombiner.value,
    k3a,
  );

  assert.ok(
    tree.equals(
      tree.intersection(
        tree.fromDistinctAscArray(oneToThirtyOne),
        tree.fromDistinctAscArray(oneToThirtyOne),
        compareIntegers,
        (v1, v2) => v1 + v2,
      ),
      tree.fromDistinctAscArray(oneToThirtyOne.map(x => x * 2)),
    ),
  );

  assert.throws(
    function () {
      tree.intersection(
        tree.fromDistinctAscArray([1, 2, 3]),
        tree.fromDistinctAscArray([1, 2, 3]),
        compareIntegers,
        (v1) => -v1,
      );
    },
    {
      name: 'ValueOrderError',
      message: 'The relative order of values has changed: expected -2 to be greater than -1',
    },
  );

  assert.throws(
    function () {
      tree.intersection(
        tree.fromDistinctAscArray([1, 2, 3]),
        tree.fromDistinctAscArray([1, 2, 3]),
        compareIntegers,
        (v1) => v1 === 2 ? 4 : v1,
      );
    },
    {
      name: 'ValueOrderError',
      message: 'The relative order of values has changed: expected 4 to be less than 3',
    },
  );

  t.test('left node reference is reused', () => {
    const leftNode1 = newNode(tree.empty, {key: 0}, tree.empty);
    const leftNode2 = newNode(tree.empty, {key: 0}, tree.empty);
    assert.equal(
      tree.intersection(
        newNode(leftNode1, {key: 1}, tree.empty),
        leftNode2,
        compareObjectKeys,
        (v1) => v1,
      ),
      leftNode1,
    );
    assert.equal(
      tree.intersection(
        newNode(leftNode1, {key: 1}, tree.empty),
        leftNode2,
        compareObjectKeys,
        (v1, v2) => v2,
      ),
      leftNode2,
    );
  });

  t.test('right node reference is reused', () => {
    const rightNode1 = newNode(tree.empty, {key: 1}, tree.empty);
    const rightNode2 = newNode(tree.empty, {key: 1}, tree.empty);
    assert.equal(
      tree.intersection(
        newNode(tree.empty, {key: 0}, rightNode1),
        rightNode2,
        compareObjectKeys,
        (v1) => v1,
      ),
      rightNode1,
    );
    assert.equal(
      tree.intersection(
        newNode(tree.empty, {key: 0}, rightNode1),
        rightNode2,
        compareObjectKeys,
        (v1, v2) => v2,
      ),
      rightNode2,
    );
  });

  t.test('entire left tree is reused', () => {
    assert.equal(tree.intersection(oneToThirtyOneTree, oneToThirtyOneTree, compareIntegers), oneToThirtyOneTree);
  });

  t.test('entire right tree is reused', () => {
    const oneToThirtyOneKeyTree2/*: ImmutableTree<KeyedObject> */ =
      tree.fromDistinctAscArray(oneToThirtyOne.map(key => ({key})));
    assert.equal(
      tree.intersection(oneToThirtyOneKeyTree, oneToThirtyOneKeyTree2, compareObjectKeys, (v1, v2) => v2),
      oneToThirtyOneKeyTree2,
    );
  });
});

test('iterate', function () {
  assert.deepEqual(
    Array.from(tree.iterate(oneToThirtyOneTree)),
    oneToThirtyOne,
  );
});

test('map', function () {
  const toString = (x/*: mixed */)/*: string */ => String(x);

  assert.equal(tree.map(tree.empty, toString), tree.empty);
  assert.deepEqual(
    tree.map(oneToThirtyOneTree, toString),
    tree.fromDistinctAscArray(oneToThirtyOne.map(toString)),
  );
});

test('maxNode', function () {
  assert.throws(
    () => { tree.maxNode/*:: <number> */(tree.empty); },
    EmptyTreeError,
    'maxNode throws EmptyTreeError',
  );
  assert.equal(tree.maxNode(oneToThirtyOneTree).value, 31, 'max node value is 31');
});

test('maxValue', function () {
  assert.equal(tree.maxValue(oneToThirtyOneTree), 31, 'max value is 31');
});

test('minNode', function () {
  assert.throws(
    () => { tree.minNode/*:: <number> */(tree.empty); },
    EmptyTreeError,
    'minNode throws EmptyTreeError',
  );
  assert.equal(tree.minNode(oneToThirtyOneTree).value, 1, 'min node value is 1');
});

test('minValue', function () {
  assert.equal(tree.minValue(oneToThirtyOneTree), 1, 'min value is 1');
});

test('remove', function () {
  assert.equal(
    tree.remove(tree.empty, 1, compareIntegers),
    tree.empty,
    'tree is empty',
  );

  let node/*: ImmutableTree<number> */ = oneToThirtyOneTree;
  node = tree.remove(node, 0, compareIntegers);
  assert.equal(node, oneToThirtyOneTree);

  let size = 31;
  for (const num of oneToThirtyOne) {
    node = tree.remove(node, num, compareIntegers);
    assert.equal(tree.find(node, num, compareIntegers, null), null);
    assert.equal(node.size, --size);
  }

  assert.equal(node, tree.empty, 'tree is empty');

  let keyNode = oneToThirtyOneKeyTree;
  size = 31;
  for (const num of oneToThirtyOne) {
    keyNode = tree.remove(keyNode, num, compareNumberWithObjectKey);
    assert.equal(tree.find(keyNode, num, compareNumberWithObjectKey, null), null);
    assert.equal(keyNode.size, --size);
  }
});

test('removeIfExists', function () {
  assert.equal(tree.remove, tree.removeIfExists);
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

test('reverseIterate', function () {
  assert.deepEqual(
    Array.from(tree.reverseIterate(oneToThirtyOneTree)),
    oneToThirtyOne.slice(0).reverse(),
  );
});

test('setDelta', function () {
  assert.doesNotThrow(function () {
    tree.setDelta(3);
  });
});

test('setIndex', function () {
  const node = tree.fromDistinctAscArray([1, 2, 3]);

  let newNode = tree.setIndex(node, 0, 7);
  newNode = tree.setIndex(newNode, 1, 8);
  newNode = tree.setIndex(newNode, 2, 9);
  assert.deepEqual(tree.toArray(newNode), [7, 8, 9]);
  assert.notEqual(newNode, node);

  // Set to the same value (should return the same node)
  newNode = tree.setIndex(node, 1, 2);
  assert.deepEqual(tree.toArray(newNode), [1, 2, 3]);
  assert.equal(newNode, node);

  // Negative indexing
  newNode = tree.setIndex(node, -1, 5);
  assert.deepEqual(tree.toArray(newNode), [1, 2, 5]);

  // Out of range indices are no-ops
  assert.equal(tree.setIndex(node, 3, 10), node);
  assert.equal(tree.setIndex(node, -4, 10), node);
});

test('splice', () => {
  const node = buildAscIntegerTree(1, 10);

  let {tree: newNode, deleted} = tree.splice(node, 0, 0, tree.empty);
  assert.equal(newNode, node);
  assert.equal(deleted, tree.empty);

  ({tree: newNode, deleted} = tree.splice(node, 100, 0, tree.empty));
  assert.equal(newNode, node);
  assert.equal(deleted, tree.empty);

  ({tree: newNode, deleted} = tree.splice(node, -Infinity, 0, tree.empty));
  assert.equal(newNode, node);
  assert.equal(deleted, tree.empty);

  ({tree: newNode, deleted} = tree.splice(node, Infinity, 0, tree.empty));
  assert.equal(newNode, node);
  assert.equal(deleted, tree.empty);

  ({tree: newNode, deleted} = tree.splice(node, 0, 0, buildAscIntegerTree(-10, 0)));
  assert.ok(tree.equals(newNode, buildAscIntegerTree(-10, 10)));
  assert.equal(deleted, tree.empty);

  ({tree: newNode, deleted} = tree.splice(node, 10, 0, buildAscIntegerTree(11, 20)));
  assert.ok(tree.equals(newNode, buildAscIntegerTree(1, 20)));
  assert.equal(deleted, tree.empty);

  for (const i of [0, -10]) {
    ({tree: newNode, deleted} = tree.splice(node, i, 10, tree.empty));
    assert.equal(newNode, tree.empty);
    assert.equal(deleted, node);
  }

  for (const i of [1, -9]) {
    ({tree: newNode, deleted} = tree.splice(node, i, 8, buildAscIntegerTree(2, 9)));
    assert.ok(tree.equals(newNode, buildAscIntegerTree(1, 10)));
    assert.ok(tree.equals(deleted, buildAscIntegerTree(2, 9)));
  }

  ({tree: newNode, deleted} = tree.splice(node, 0, 10, buildAscIntegerTree(-10, 0)));
  assert.ok(tree.equals(newNode, buildAscIntegerTree(-10, 0)));
  assert.equal(deleted, node);
});

test('split', function () {
  // test/monkey.js contains a more thorough test.
  let small, equal, large;

  [small, equal, large] = tree.split(tree.empty, 0, compareIntegers);
  assert.equal(small, tree.empty);
  assert.equal(equal, tree.empty);
  assert.equal(large, tree.empty);

  [small, equal, large] = tree.split(
    tree.fromDistinctAscArray([1, 2, 3]),
    2,
    compareIntegers,
  );
  assert.ok(tree.equals(small, tree.create(1)));
  assert.ok(equal.size === 3 && equal.value === 2);
  assert.ok(tree.equals(large, tree.create(3)));

  [small, equal, large] = tree.split(
    tree.fromDistinctAscArray([1, 3]),
    2,
    compareIntegers,
  );
  assert.ok(tree.equals(small, tree.create(1)));
  assert.ok(equal.size === 0);
  assert.ok(tree.equals(large, tree.create(3)));
});

test('splitFirst', () => {
  const node1 = tree.create(1);
  let result = tree.splitFirst(node1);
  assert.equal(result.value, 1);
  assert.equal(result.tree, tree.empty);

  const node2 = tree.fromDistinctAscArray([1, 2, 3]);
  /*:: invariant(node2.size !== 0); */
  result = tree.splitFirst(node2);
  assert.equal(result.value, 1);
  assert.ok(tree.equals(result.tree, tree.fromDistinctAscArray([2, 3])));
});

test('splitIndex', () => {
  let small, equal, large;

  for (let i = -1; i <= 1; i++) {
    [small, equal, large] = tree.splitIndex/*:: <number, number> */(tree.empty, i);
    assert.equal(small, tree.empty);
    assert.equal(equal, tree.empty);
    assert.equal(large, tree.empty);
  }

  for (let i = 1; i <= 31; i++) {
    [small, equal, large] = tree.splitIndex(oneToThirtyOneTree, i - 1);
    assert.ok(
      tree.equals(
        small,
        tree.fromDistinctAscArray(buildAscIntegerArray(1, i - 1)),
      ),
    );
    assert.equal(equal.value, i);
    assert.ok(
      tree.equals(
        large,
        tree.fromDistinctAscArray(buildAscIntegerArray(i + 1, 31)),
      ),
    );
  }
});

test('splitLast', () => {
  const node1 = tree.create(1);
  let result = tree.splitLast(node1);
  assert.equal(result.value, 1);
  assert.equal(result.tree, tree.empty);

  const node2 = tree.fromDistinctAscArray([1, 2, 3]);
  /*:: invariant(node2.size !== 0); */
  result = tree.splitLast(node2);
  assert.equal(result.value, 3);
  assert.ok(tree.equals(result.tree, tree.fromDistinctAscArray([1, 2])));
});

test('union', function (t) {
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
      oneToThirtyOneTree,
    ),
  );

  const k3a = {key: 3};
  const k3b = {key: 3};

  const unionWithDefaultConflictHandler = tree.union(
    tree.fromDistinctAscArray([{key: 1}, {key: 2}, k3a]),
    tree.fromDistinctAscArray([k3b, {key: 4}, {key: 5}]),
    compareObjectKeys,
  );
  assert.deepEqual(
    tree.toArray(
      unionWithDefaultConflictHandler,
    ),
    [{key: 1}, {key: 2}, {key: 3}, {key: 4}, {key: 5}],
  );
  assert.equal(
    tree.find(unionWithDefaultConflictHandler, {key: 3}, compareObjectKeys, null),
    k3a,
  );

  const unionWithCustomConflictHandler = tree.union(
    tree.fromDistinctAscArray([{key: 1}, {key: 2}, k3a]),
    tree.fromDistinctAscArray([k3b, {key: 4}, {key: 5}]),
    compareObjectKeys,
    (v1) => v1,
  );
  assert.deepEqual(
    tree.toArray(
      unionWithCustomConflictHandler,
    ),
    [{key: 1}, {key: 2}, {key: 3}, {key: 4}, {key: 5}],
  );
  assert.equal(
    tree.find(unionWithCustomConflictHandler, {key: 3}, compareObjectKeys, null),
    k3a,
  );

  assert.ok(
    tree.equals(
      tree.union(
        tree.fromDistinctAscArray(oneToThirtyOne),
        tree.fromDistinctAscArray(oneToThirtyOne),
        compareIntegers,
        (v1, v2) => v1 + v2,
      ),
      tree.fromDistinctAscArray(oneToThirtyOne.map(x => x * 2)),
    ),
  );

  assert.throws(
    function () {
      tree.union(
        tree.fromDistinctAscArray([1, 2, 3]),
        tree.fromDistinctAscArray([1, 2, 3]),
        compareIntegers,
        (v1) => -v1,
      );
    },
    {
      name: 'ValueOrderError',
      message: 'The relative order of values has changed: expected -2 to be greater than -1',
    },
  );

  assert.throws(
    function () {
      tree.union(
        tree.fromDistinctAscArray([1, 2, 3]),
        tree.fromDistinctAscArray([1, 2, 3]),
        compareIntegers,
        (v1) => v1 === 2 ? 4 : v1,
      );
    },
    {
      name: 'ValueOrderError',
      message: 'The relative order of values has changed: expected 4 to be less than 3',
    },
  );

  t.test('left node reference is reused', () => {
    const leftNode1 = newNode(tree.empty, {key: 0}, tree.empty);
    const leftNode2 = newNode(tree.empty, {key: 0}, tree.empty);
    assert.equal(
      tree.union(
        newNode(leftNode1, {key: 1}, tree.empty),
        leftNode2,
        compareObjectKeys,
        (v1) => v1,
      ).left,
      leftNode1,
    );
    assert.equal(
      tree.union(
        newNode(leftNode1, {key: 1}, tree.empty),
        leftNode2,
        compareObjectKeys,
        (v1, v2) => v2,
      ).left,
      leftNode2,
    );
  });

  t.test('right node reference is reused', () => {
    const rightNode1 = newNode(tree.empty, {key: 1}, tree.empty);
    const rightNode2 = newNode(tree.empty, {key: 1}, tree.empty);
    assert.equal(
      tree.union(
        newNode(tree.empty, {key: 0}, rightNode1),
        rightNode2,
        compareObjectKeys,
        (v1) => v1,
      ).right,
      rightNode1,
    );
    assert.equal(
      tree.union(
        newNode(tree.empty, {key: 0}, rightNode1),
        rightNode2,
        compareObjectKeys,
        (v1, v2) => v2,
      ).right,
      rightNode2,
    );
  });

  t.test('entire left tree is reused', () => {
    assert.equal(tree.union(oneToThirtyOneTree, oneToThirtyOneTree, compareIntegers), oneToThirtyOneTree);
  });

  t.test('entire right tree is reused', () => {
    const oneToThirtyOneKeyTree2/*: ImmutableTree<KeyedObject> */ =
      tree.fromDistinctAscArray(oneToThirtyOne.map(key => ({key})));
    assert.equal(
      tree.union(oneToThirtyOneKeyTree, oneToThirtyOneKeyTree2, compareObjectKeys, (v1, v2) => v2),
      oneToThirtyOneKeyTree2,
    );
  });
});

test('toArray', function () {
  assert.deepEqual(tree.toArray/*:: <mixed> */(tree.empty).sort(), []);
  assert.deepEqual(tree.toArray(tree.create(1)), [1]);
  assert.deepEqual(tree.toArray(tree.fromDistinctAscArray([1, 2, 3])), [1, 2, 3]);
  assert.deepEqual(tree.toArray(tree.fromDistinctAscArray([3, 2, 1])), [3, 2, 1]);
});

test('update', function (t) {
  t.test('onNotFoundDoNothing', function () {
    const node = tree.create(1);
    const newNode = tree.update(node, {
      key: 2,
      cmp: compareIntegers,
      onConflict: onConflictThrowError,
      onNotFound: onNotFoundDoNothing,
    });
    assert.equal(newNode, node, 'tree was not updated with onNotFoundDoNothing');
  });

  t.test('onNotFoundThrowError', function () {
    assert.throws(
      () => {
        tree.update/*:: <number, number> */(tree.empty, {
          key: 1,
          cmp: compareIntegers,
          onConflict: onConflictKeepTreeValue,
          onNotFound: onNotFoundThrowError,
        });
      },
      ValueNotFoundError,
    );
  });

  t.test('onNotFoundUseGivenValue', function () {
    const node = tree.update/*:: <number, number> */(tree.empty, {
      key: 1,
      cmp: compareIntegers,
      onConflict: onConflictKeepTreeValue,
      onNotFound: onNotFoundUseGivenValue,
    });
    assert.equal(node.value, 1);
  });

  const v1 = {key: 1, value: 10};
  const v2 = {key: 2, value: 20};

  let node/*: ImmutableTree<KeyedObject> */ = tree.create(v1);

  node = tree.update(
    node,
    {
      key: v2,
      cmp: compareObjectKeys,
      onConflict: onConflictThrowError,
      onNotFound: (newItem) => {
        assert.equal(newItem, v2);
        return v2;
      },
    },
  );
  assert.equal(tree.find(node, v2, compareObjectKeys, null), v2);

  node = tree.update(node, {
    key: 3,
    cmp: compareNumberWithObjectKey,
    onConflict: onConflictThrowError,
    onNotFound: (newKey) => {
      return {key: newKey, value: newKey * 10};
    }},
  );
  let v3 = tree.find(node, 3, compareNumberWithObjectKey, null);
  assert.deepEqual(v3, {key: 3, value: 30});

  node = tree.update(node, {
    key: 3,
    cmp: compareNumberWithObjectKey,
    onConflict: onConflictKeepTreeValue,
    onNotFound: (newKey) => {
      return {key: newKey, value: newKey * 10};
    }},
  );
  assert.deepEqual(
    tree.find(node, 3, compareNumberWithObjectKey, null),
    v3,
    'existing tree value it kept',
  );

  node = tree.update(node, {
    key: 3,
    cmp: compareNumberWithObjectKey,
    onConflict: treeValue => treeValue,
    onNotFound: () => {
      throw new Error('unexpected');
    }},
  );
  assert.deepEqual(
    tree.find(node, 3, compareNumberWithObjectKey, null),
    v3,
    'new tree value is used',
  );

  assert.throws(
    function () {
      node = tree.update(node, {
        key: {key: 4, value: 40},
        cmp: compareObjectKeys,
        onConflict: onConflictKeepTreeValue,
        onNotFound: () => {
          return {key: 5, value: 50};
        },
      });
    },
    {
      name: 'ValueOrderError',
      message: 'The relative order of values has changed: ' +
        'expected [object Object] to be equal to [object Object]',
    }
  );

  class CustomNotFoundError extends Error {}

  assert.throws(
    function () {
      node = tree.update(node, {
        key: 5,
        cmp: compareNumberWithObjectKey,
        onConflict: (treeValue) => treeValue,
        onNotFound: () => {
          throw new CustomNotFoundError();
        },
      });
    },
    CustomNotFoundError,
  );
});

test('validate', function () {
  assert.ok(tree.validate(tree.empty, compareIntegers).valid, 'null tree is valid');
  assert.ok(tree.validate(tree.create(1), compareIntegers).valid, 'tree of size 1 is valid');

  let node/*: ImmutableTree<number> */ = newNode(tree.create(2), 1, tree.empty);
  let result = tree.validate(node, compareIntegers);
  assert.ok(!result.valid, 'tree is invalid');
  assert.equal(result.subtree, 'left');
  assert.equal(result.tree, node);

  node = newNode(tree.empty, 1, tree.create(0));
  result = tree.validate(node, compareIntegers);
  assert.ok(!result.valid, 'tree is invalid');
  assert.equal(result.subtree, 'right');
  assert.equal(result.tree, node);
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

  let node = oneToThirtyOneTree;
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

  assert.ok(
    tree.equals(
      integerTree.intersection(
        tree.fromDistinctAscArray([1, 2, 3]),
        tree.fromDistinctAscArray([3, 4, 5]),
        (v1) => v1,
      ),
      tree.create(3),
    ),
  );

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

  const [smallSplit, equalSplit, largeSplit] = integerTree.split(
    tree.fromDistinctAscArray([1, 2, 3]),
    2,
  );
  assert.ok(tree.equals(smallSplit, tree.create(1)));
  assert.ok(equalSplit.size === 3 && equalSplit.value === 2);
  assert.ok(tree.equals(largeSplit, tree.create(3)));

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
  node = integerTree.update(node, {
    // $FlowIgnore[incompatible-call]
    key: num1,
    onConflict: onConflictKeepTreeValue,
    onNotFound: onNotFoundThrowError,
  });
  assert.equal(integerTree.find(node, 1), 1);
  node = integerTree.update(node, {
    // $FlowIgnore[incompatible-call]
    key: num1,
    onConflict: onConflictUseGivenValue,
    onNotFound: onNotFoundThrowError,
  });
  // $FlowIgnore[incompatible-call]
  assert.equal(integerTree.find(node, 1), num1);
  assert.throws(
    function () {
      node = integerTree.update(node, {
        key: 1,
        onConflict: onConflictThrowError,
        onNotFound: onNotFoundThrowError,
      });
    },
    ValueExistsError,
    'exception is thrown with update using onConflictThrowError',
  );
  node = integerTree.update(node, {
    key: 32,
    onConflict: onConflictThrowError,
    onNotFound: onNotFoundDoNothing,
  });
  assert.equal(integerTree.find(node, 32), undefined);
  node = integerTree.update(node, {
    key: 32,
    onConflict: onConflictThrowError,
    onNotFound: onNotFoundUseGivenValue,
  });
  assert.equal(integerTree.find(node, 32), 32);

  assert.ok(integerTree.validate(node).valid);
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

test('JSON.stringify', function () {
  const reparsedTree = JSON.parse(JSON.stringify(oneToThirtyOneKeyTree));
  assert.deepEqual(
    oneToThirtyOneKeyTree,
    reparsedTree,
  );
  assert.ok(
    tree.equals(
      oneToThirtyOneKeyTree,
      reparsedTree,
      (a/*: KeyedObject */, b/*: KeyedObject */) => compareObjectKeys(a, b) === 0,
    ),
  );
});
