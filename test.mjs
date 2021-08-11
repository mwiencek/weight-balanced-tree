// @flow strict

import test from 'tape';

import * as tree from './index.mjs';

function cmpIntegers(a: number, b: number): number {
  return a - b;
}

function shuffle(array: Array<number>): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // $FlowIssue[unsupported-syntax]
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function countSize(node: tree.ImmutableTreeT<mixed> | null): number {
  if (node === null) {
    return 0;
  }
  return 1 + countSize(node.left) + countSize(node.right);
}

function checkBalance(node: tree.ImmutableTreeT<mixed>): boolean {
  if (
    (node.left === null || node.left.size === 1) &&
    (node.right === null || node.right.size === 1)
  ) {
    return true;
  }
  return (
    tree.getSize(node.left) <= (3 * tree.getSize(node.right)) &&
    tree.getSize(node.right) <= (3 * tree.getSize(node.left))
  );
}

function checkTreeInvariants(
  t: tape$Context,
  node: tree.ImmutableTreeT<number> | null,
): void {
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
  node: tree.ImmutableTreeT<mixed> | null,
): string {
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
  const oneToThirtyOne = [];

  for (let i = 1; i <= 31; i++) {
    oneToThirtyOne.push(i);
  }

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

    shuffle(numbers);

    for (const num of numbers) {
      let foundNode = tree.find(node, num, cmpIntegers);
      t.ok(foundNode !== null && foundNode.value === num, 'existing node is found');

      node = tree.remove(node, num, cmpIntegers);
      checkTreeInvariants(t, node);

      foundNode = tree.find(node, num, cmpIntegers);
      t.ok(foundNode === null, 'removed node is not found');
    }

    t.ok(node === null, 'tree is empty');
  }

  t.end();
});

test('actions', function (t) {
  let node = null;

  const compareX = (a, b) => a.x.localeCompare(b.x);

  const xa1 = {x: 'a', y: '1'};
  const xa2 = {x: 'a', y: '2'};
  const xb1 = {x: 'b', y: '1'};
  const xb2 = {x: 'b', y: '2'};

  node = tree.insert(node, xa1, compareX);

  let prevNode = node;
  node = tree.insert(node, xa2, compareX, tree.NOOP);
  t.ok(node === prevNode, 'tree is unmodified with duplicateAction = NOOP (root node)');
  t.ok(node !== null && node.value === xa1, 'tree value is unmodified with duplicateAction = NOOP (root node)');

  prevNode = node;
  node = tree.insert(node, xa2, compareX, tree.REPLACE);
  t.ok(node !== prevNode, 'tree is modified with duplicateAction = REPLACE (root node)');
  t.ok(node !== null && node.value === xa2, 'tree value is modified with duplicateAction = REPLACE (root node)');

  prevNode = node;
  node = tree.insert(node, xa2, compareX, (tree, value) => ({...tree, value: {x: value.x, y: tree.value.x + tree.value.y}}));
  t.ok(node !== prevNode, 'tree is modified with duplicateAction = function (root node)');
  t.ok(node !== null && node.value.y === 'a2', 'tree value is modified with duplicateAction = function (root node)');

  t.throws(
    function () {
      node = tree.insert(node, xa1, compareX, tree.THROW);
    },
    /^Error$/,
    'exception is thrown with duplicateAction = THROW (root node)',
  );

  node = tree.insert(node, xb1, compareX);

  prevNode = node;
  node = tree.insert(node, xb1, compareX, tree.NOOP);
  t.ok(node === prevNode, 'tree is unmodified with duplicateAction = NOOP (non-root node)');

  prevNode = node;
  node = tree.insert(node, xb2, compareX, tree.REPLACE);
  t.ok(node !== prevNode, 'tree is modified with duplicateAction = REPLACE (non-root node)');
  t.ok(node !== null && node.right !== null && node.right.value === xb2, 'tree value is modified with duplicateAction = REPLACE (non-root node)');

  prevNode = node;
  node = tree.insert(node, xb2, compareX, (tree, value) => ({...tree, value: {x: value.x, y: tree.value.x + tree.value.y}}));
  t.ok(node !== prevNode, 'tree is modified with duplicateAction = function (non-root node)');
  t.ok(node !== null && node.right !== null && node.right.value.y === 'b2', 'tree value is modified with duplicateAction = function (non-root node)');

  t.throws(
    function () {
      node = tree.insert(node, xb1, compareX, tree.THROW);
    },
    /^Error$/,
    'exception is thrown with duplicateAction = THROW (non-root node)',
  );

  node = tree.remove(node, xb1, compareX);

  prevNode = node;
  node = tree.remove(node, xb1, compareX, tree.NOOP);
  t.ok(prevNode === node, 'tree is unmodified with notFoundAction = NOOP');

  t.throws(
    function () {
      node = tree.remove(node, xb1, compareX, tree.THROW);
    },
    /^Error$/,
    'exception is thrown with notFoundAction = THROW',
  );

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
