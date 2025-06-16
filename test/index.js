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

const oneToThirtyOne = [];

for (let i = 1; i <= 31; i++) {
  oneToThirtyOne.push(i);
}

const oneToThirtyOneTree = tree.fromDistinctAscArray(oneToThirtyOne);
const oneToThirtyOneKeyTree/*: ImmutableTree<KeyedObject> */ =
  tree.fromDistinctAscArray(oneToThirtyOne.map(key => ({key})));

test('at', function () {
  const node = oneToThirtyOneTree;
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

test('create', function () {
  const node = tree.create(1);
  assert.deepEqual(node, {
    left: tree.empty,
    right: tree.empty,
    size: 1,
    value: 1,
  });
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
});

test('empty', function () {
  const empty = tree.empty;
  assert.equal(empty.size, 0, 'empty has size 0');
  assert.equal(empty.left, empty, 'empty left node is empty');
  assert.equal(empty.right, empty, 'empty right node is empty');
  assert.equal(empty.value, undefined, 'empty has undefined value');
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
  let foundValue;

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
  let foundValue;

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

test('fromDistinctAscArray', function () {
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

test('intersection', function () {
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
    k3b,
  );

  const intersectionWithCustomCombiner = tree.intersection(
    tree.fromDistinctAscArray([k3a]),
    tree.fromDistinctAscArray([k3b]),
    compareObjectKeys,
    (v1, v2) => v1,
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
        (v1, v2) => -v1,
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
        (v1, v2) => v1 === 2 ? 4 : v1,
      );
    },
    {
      name: 'ValueOrderError',
      message: 'The relative order of values has changed: expected 4 to be less than 3',
    },
  );
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

test('setBalancingParameters', function () {
  assert.doesNotThrow(function () {
    tree.setBalancingParameters(3, 2);
  });
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

test('union', function () {
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
    k3b,
  );

  const unionWithCustomConflictHandler = tree.union(
    tree.fromDistinctAscArray([{key: 1}, {key: 2}, k3a]),
    tree.fromDistinctAscArray([k3b, {key: 4}, {key: 5}]),
    compareObjectKeys,
    (v1, v2) => v1,
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
        (v1, v2) => -v1,
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
        (v1, v2) => v1 === 2 ? 4 : v1,
      );
    },
    {
      name: 'ValueOrderError',
      message: 'The relative order of values has changed: expected 4 to be less than 3',
    },
  );
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
    const newNode = tree.update(
      node,
      2,
      compareIntegers,
      onConflictThrowError,
      onNotFoundDoNothing,
    );
    assert.equal(newNode, node, 'tree was not updated with onNotFoundDoNothing');
  });

  t.test('onNotFoundThrowError', function () {
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

  t.test('onNotFoundUseGivenValue', function () {
    const node = tree.update/*:: <number, number> */(
      tree.empty,
      1,
      compareIntegers,
      onConflictKeepTreeValue,
      onNotFoundUseGivenValue,
    );
    assert.equal(node.value, 1);
  });

  const v1 = {key: 1, value: 10};
  const v2 = {key: 2, value: 20};

  let node/*: ImmutableTree<KeyedObject> */ = tree.create(v1);

  node = tree.update(
    node,
    v2,
    compareObjectKeys,
    onConflictThrowError,
    (newItem) => {
      assert.equal(newItem, v2);
      return v2;
    },
  );
  assert.equal(tree.find(node, v2, compareObjectKeys, null), v2);

  node = tree.update(
    node,
    3,
    compareNumberWithObjectKey,
    onConflictThrowError,
    (newKey) => {
      return {key: newKey, value: newKey * 10};
    },
  );
  let v3 = tree.find(node, 3, compareNumberWithObjectKey, null);
  assert.deepEqual(v3, {key: 3, value: 30});

  node = tree.update(
    node,
    3,
    compareNumberWithObjectKey,
    onConflictKeepTreeValue,
    (newKey) => {
      return {key: newKey, value: newKey * 10};
    },
  );
  assert.deepEqual(
    tree.find(node, 3, compareNumberWithObjectKey, null),
    v3,
    'existing tree value it kept',
  );

  node = tree.update(
    node,
    3,
    compareNumberWithObjectKey,
    (treeValue, key) => {
      v3 = {key, value: key * 10};
      return v3;
    },
    () => {
      throw new Error('unexpected');
    },
  );
  assert.deepEqual(
    tree.find(node, 3, compareNumberWithObjectKey, null),
    v3,
    'new tree value is used',
  );

  assert.throws(
    function () {
      node = tree.update(
        node,
        {key: 4, value: 40},
        compareObjectKeys,
        onConflictKeepTreeValue,
        (newValue) => {
          return {key: 5, value: 50};
        },
      );
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
      node = tree.update(
        node,
        5,
        compareNumberWithObjectKey,
        (treeValue, key) => treeValue,
        () => {
          throw new CustomNotFoundError();
        },
      );
    },
    CustomNotFoundError,
  );
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
        (v1, v2) => v1,
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
