// @flow strict

import test from 'tape';

import * as tree from './index.mjs';
import {
  NOOP,
  REPLACE,
  THROW,
  onConflictKeepTreeValue,
  onConflictThrowError,
  onConflictUseGivenValue,
} from './insert.mjs';

const oneToThirtyOne = [];

for (let i = 1; i <= 31; i++) {
  oneToThirtyOne.push(i);
}

function cmpIntegers(a/*: number */, b/*: number */)/*: number */ {
  return a - b;
}

function shuffle(array/*: Array<number> */)/*: void */ {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // $FlowIssue[unsupported-syntax]
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function countSize(
  node/*: tree.ImmutableTree<mixed> | null */,
)/*: number */ {
  if (node === null) {
    return 0;
  }
  return 1 + countSize(node.left) + countSize(node.right);
}

function checkBalance(
  node/*: tree.ImmutableTree<mixed> */,
)/*: boolean */ {
  if (
    (node.left === null || node.left.size === 1) &&
    (node.right === null || node.right.size === 1)
  ) {
    return true;
  }
  return (
    (node.left === null ? 0 : node.left.size) <= (3 * (node.right === null ? 0 : node.right.size)) &&
    (node.right === null ? 0 : node.right.size) <= (3 * (node.left === null ? 0 : node.left.size))
  );
}

function checkTreeInvariants(
  t/*: tape$Context */,
  node/*: tree.ImmutableTree<number> | null */,
)/*: void */ {
  if (node === null) {
    return;
  }

  const actualSize = countSize(node);
  if (node.size !== actualSize) {
    t.comment('wrong tree size: ' + treeToString(node));
  }
  t.equal(node.size, actualSize, 'stored size is correct');

  const isBalanced = checkBalance(node);
  if (!isBalanced) {
    t.comment('unbalanced tree: ' + treeToString(node));
  }
  t.ok(isBalanced, 'node is balanced');

  if (node.left) {
    t.ok(node.left.value < node.value, 'left node has a smaller value');
    checkTreeInvariants(t, node.left);
  }

  if (node.right) {
    t.ok(node.right.value > node.value, 'right node has a larger value');
    checkTreeInvariants(t, node.right);
  }
}

function treeToString(
  node/*: tree.ImmutableTree<mixed> | null */,
)/*: string */ {
  if (node === null) {
    return '';
  }
  const leftTree = treeToString(node.left);
  const rightTree = treeToString(node.right);
  return (
    String(node.value) + ' ' + String(node.size) +
    (leftTree ? '(' + leftTree + ')' : '') +
    (rightTree ? '(' + rightTree + ')' : '')
  );
}

test('all', function (t) {
  const thirtyOneToOne = oneToThirtyOne.slice(0).reverse();

  const numbers = oneToThirtyOne.slice(0);

  for (let i = 0; i < 5; i++) {
    let node = null;

    for (const num of numbers) {
      node = tree.insert(node, num, cmpIntegers);
      checkTreeInvariants(t, node);
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
      const next = tree.findNext(node, num, cmpIntegers);
      t.equal(
        next === null ? null : next.value,
        num < 31 ? (num + 1) : null,
        'next node is found',
      );

      const prev = tree.findPrev(node, num, cmpIntegers);
      t.equal(
        prev === null ? null : prev.value,
        num > 1 ? (num - 1) : null,
        'prev node is found',
      );
    }

    for (const num of numbers) {
      let foundNode = tree.find(node, num, cmpIntegers);
      t.ok(foundNode !== null && foundNode.value === num, 'existing node is found');

      node = tree.remove(node, num, cmpIntegers);
      checkTreeInvariants(t, node);

      foundNode = tree.find(node, num, cmpIntegers);
      t.ok(foundNode === null, 'removed node is not found');
    }

    t.ok(node === null, 'tree is empty');

    node = tree.remove(node, 0, cmpIntegers);
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
  const cmp = (a, b) => a - b;

  let node = null;
  node = tree.insert(node, 1, cmp);
  node = tree.insert(node, 3, cmp);
  node = tree.insert(node, 5, cmp);
  node = tree.insert(node, 7, cmp);
  node = tree.insert(node, 9, cmp);

  t.equal(tree.findNext(node, 0, cmp)?.value, 1);
  t.equal(tree.findNext(node, 1, cmp)?.value, 3);
  t.equal(tree.findNext(node, 2, cmp)?.value, 3);
  t.equal(tree.findNext(node, 3, cmp)?.value, 5);
  t.equal(tree.findNext(node, 4, cmp)?.value, 5);
  t.equal(tree.findNext(node, 5, cmp)?.value, 7);
  t.equal(tree.findNext(node, 6, cmp)?.value, 7);
  t.equal(tree.findNext(node, 7, cmp)?.value, 9);
  t.equal(tree.findNext(node, 8, cmp)?.value, 9);
  t.equal(tree.findNext(node, 9, cmp), null);

  t.equal(tree.findPrev(node, 1, cmp), null);
  t.equal(tree.findPrev(node, 2, cmp)?.value, 1);
  t.equal(tree.findPrev(node, 3, cmp)?.value, 1);
  t.equal(tree.findPrev(node, 4, cmp)?.value, 3);
  t.equal(tree.findPrev(node, 5, cmp)?.value, 3);
  t.equal(tree.findPrev(node, 6, cmp)?.value, 5);
  t.equal(tree.findPrev(node, 7, cmp)?.value, 5);
  t.equal(tree.findPrev(node, 8, cmp)?.value, 7);
  t.equal(tree.findPrev(node, 9, cmp)?.value, 7);
  t.equal(tree.findPrev(node, 10, cmp)?.value, 9);

  t.end();
});

test('insertIfNotExists', function (t) {
  const cmp = (a, b) => a.value - b.value;

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
  const cmp = (a, b) => a.value - b.value;

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
  const cmp = (a, b) => a.value - b.value;

  let node = null;
  for (const num of oneToThirtyOne) {
    node = tree.insert(node, {value: num}, cmp);
    t.throws(
      function () {
        node = tree.insertOrThrowIfExists(node, {value: num}, cmp);
      },
      /^Error$/,
      'exception is thrown with insertOrThrowIfExists',
    );
    t.throws(
      function () {
        node = tree.insert(node, {value: num}, cmp, onConflictThrowError);
      },
      /^Error$/,
      'exception is thrown with insert plus onConflictThrowError',
    );
    t.throws(
      function () {
        node = tree.insert(node, {value: num}, cmp);
      },
      /^Error$/,
      'exception is thrown with insert by default',
    );
  }

  t.equal(node?.size, 31);
  t.end();
});

test('removeIfExists', function (t) {
  const cmp = (a, b) => a - b;

  let node = tree.create(1);
  node = tree.insert(node, 2, cmp);

  const origNode = node;
  node = tree.removeIfExists(node, 3, cmp);
  t.equal(node, origNode);
  node = tree.remove(node, 3, cmp);
  t.equal(node, origNode);
  const node2 = tree.removeIfExists(node, 2, cmp);
  t.equal(node2?.size, 1);
  t.equal(node2?.value, 1);
  const node3 = tree.remove(node, 2, cmp);
  t.equal(node3?.size, 1);
  t.equal(node3?.value, 1);
  const node4 = tree.removeIfExists(node2, 1, cmp);
  t.equal(node4, null);
  const node5 = tree.remove(node3, 1, cmp);
  t.equal(node5, null);
  const node6 = tree.removeIfExists(null, 1, cmp);
  t.equal(node6, null);
  const node7 = tree.remove(null, 1, cmp);
  t.equal(node7, null);

  t.end();
});

test('removeOrThrowIfNotExists', function (t) {
  const cmp = (a, b) => a - b;

  let node = tree.create(1);
  t.throws(
    function () {
      node = tree.removeOrThrowIfNotExists(node, 2, cmp);
    },
    /^Error: The value given to remove does not exist in the tree\.$/,
    'exception is thrown with removeOrThrowIfNotExists',
  );
  t.equal(node?.size, 1);
  node = tree.removeOrThrowIfNotExists(node, 1, cmp);
  t.equal(node, null);

  t.end();
});

test('remove returns the same tree back if there is no value to remove', function (t) {
  let node = null;
  for (const num of oneToThirtyOne) {
    node = tree.insert(node, num, cmpIntegers);
  }

  const origNode = node;
  for (const num of oneToThirtyOne) {
    node = tree.remove(node, num + 31, cmpIntegers);
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
