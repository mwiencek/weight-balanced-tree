// @flow strict

export type ImmutableTreeT<+T> = {
  +value: T,
  +size: number,
  +left: ImmutableTreeT<T> | null,
  +right: ImmutableTreeT<T> | null,
};

export type MutableTreeT<T> = {
  value: T,
  size: number,
  left: ImmutableTreeT<T> | null,
  right: ImmutableTreeT<T> | null,
};

declare var invariant: (mixed) => void;

/*
 * DELTA and RATIO are taken from GHC:
 * https://gitlab.haskell.org/ghc/packages/containers/-/blob/f00aa02/containers/src/Data/Map/Internal.hs#L4011-4017
 */
const DELTA = 3;
const RATIO = 2;

export type TreeActionT<T> =
  (tree: ImmutableTreeT<T>, value: T) => ImmutableTreeT<T>;

export type SomeTreeActionT =
  <T>(tree: ImmutableTreeT<T>, value: T) => ImmutableTreeT<T>;

export const NOOP: SomeTreeActionT =
  <T>(tree: ImmutableTreeT<T>): ImmutableTreeT<T> => tree;

export const REPLACE: SomeTreeActionT =
  <T>(tree: ImmutableTreeT<T>, value: T): ImmutableTreeT<T> => ({
    value,
    size: tree.size,
    left: tree.left,
    right: tree.right,
  });

export const THROW: SomeTreeActionT = () => {
  throw new Error('');
};

function rotateLeft<T>(a: MutableTreeT<T>): void {
  const b = a.right;
  /*:: invariant(b); */
  const c = b.right;
  /*:: invariant(c); */
  const left = {
    value: a.value,
    size: (a.left === null ? 0 : a.left.size) + (b.left === null ? 0 : b.left.size) + 1,
    left: a.left,
    right: b.left,
  };
  a.value = b.value;
  a.size = left.size + c.size + 1;
  a.left = left;
  a.right = c;
}

function rotateRight<T>(c: MutableTreeT<T>): void {
  const b = c.left;
  /*:: invariant(b); */
  const a = b.left;
  /*:: invariant(a); */
  const right = {
    value: c.value,
    size: (b.right === null ? 0 : b.right.size) + (c.right === null ? 0 : c.right.size) + 1,
    left: b.right,
    right: c.right,
  };
  c.value = b.value;
  c.size = a.size + right.size + 1;
  c.left = a;
  c.right = right;
}

function rotateLeftRight<T>(tree: MutableTreeT<T>): void {
  const a = tree.left;
  /*:: invariant(a); */
  const b = a.right;
  /*:: invariant(b); */
  const c = b.right;
  /*:: invariant(c); */
  const left = {
    value: a.value,
    size: (a.left === null ? 0 : a.left.size) + (b.left === null ? 0 : b.left.size) + 1,
    left: a.left,
    right: b.left,
  };
  const right = {
    value: tree.value,
    size: (c === null ? 0 : c.size) + (tree.right === null ? 0 : tree.right.size) + 1,
    left: c,
    right: tree.right,
  };
  tree.value = b.value;
  tree.size = left.size + right.size + 1;
  tree.left = left;
  tree.right = right;
}

function rotateRightLeft<T>(tree: MutableTreeT<T>): void {
  const c = tree.right;
  /*:: invariant(c); */
  const b = c.left;
  /*:: invariant(b); */
  const a = b.left;
  /*:: invariant(a); */
  const right = {
    value: c.value,
    size: (b.right === null ? 0 : b.right.size) + (c.right === null ? 0 : c.right.size) + 1,
    left: b.right,
    right: c.right,
  };
  const left = {
    value: tree.value,
    size: (tree.left === null ? 0 : tree.left.size) + (a === null ? 0 : a.size) + 1,
    left: tree.left,
    right: a,
  };
  tree.value = b.value;
  tree.size = left.size + right.size + 1;
  tree.left = left;
  tree.right = right;
}

function balanceLeft<T>(tree: MutableTreeT<T>): void {
  const left = tree.left;
  const right = tree.right;
  const leftSize = (left === null ? 0 : left.size);
  const rightSize = (right === null ? 0 : right.size);

  if ((leftSize + rightSize) < 2) {
    return;
  }

  if (leftSize > (DELTA * rightSize)) {
    /*:: invariant(left); */
    if ((left.right === null ? 0 : left.right.size) < (RATIO * (left.left === null ? 0 : left.left.size))) {
      rotateRight(tree);
    } else {
      rotateLeftRight(tree);
    }
  }
}

function balanceRight<T>(tree: MutableTreeT<T>): void {
  const left = tree.left;
  const right = tree.right;
  const leftSize = (left === null ? 0 : left.size);
  const rightSize = (right === null ? 0 : right.size);

  if ((leftSize + rightSize) < 2) {
    return;
  }

  if (rightSize > (DELTA * leftSize)) {
    /*:: invariant(right); */
    if ((right.left === null ? 0 : right.left.size) < (RATIO * (right.right === null ? 0 : right.right.size))) {
      rotateLeft(tree);
    } else {
      rotateRightLeft(tree);
    }
  }
}

export function minValue<T>(
  tree: ImmutableTreeT<T>,
): T {
  let node = tree;
  while (node.left !== null) {
    node = node.left;
  }
  return node.value;
}

export function maxValue<T>(
  tree: ImmutableTreeT<T>,
): T {
  let node = tree;
  while (node.right !== null) {
    node = node.right;
  }
  return node.value;
}

export function remove<T>(
  tree: ImmutableTreeT<T> | null,
  value: T,
  cmp: (T, T) => number,
  notFoundAction: TreeActionT<T>,
): ImmutableTreeT<T> | null {
  if (tree === null) {
    return null;
  }

  const order = cmp(value, tree.value);
  let newTree: MutableTreeT<T> | null = null;

  if (order === 0) {
    if (tree.left === null) {
      return tree.right;
    }
    if (tree.right === null) {
      return tree.left;
    }
    const min = minValue(tree.right);
    newTree = {
      value: min,
      size: tree.size - 1,
      left: tree.left,
      right: remove(tree.right, min, cmp, THROW),
    };
    balanceLeft(newTree);
    return newTree;
  }

  let left = tree.left;
  let right = tree.right;

  if (order < 0) {
    if (left !== null) {
      left = remove(left, value, cmp, notFoundAction);
      newTree = {
        value: tree.value,
        size: (left === null ? 0 : left.size) + (right === null ? 0 : right.size) + 1,
        left,
        right,
      };
      balanceRight(newTree);
    }
  } else if (right !== null) {
    right = remove(right, value, cmp, notFoundAction);
    newTree = {
      value: tree.value,
      size: (left === null ? 0 : left.size) + (right === null ? 0 : right.size) + 1,
      left,
      right,
    };
    balanceLeft(newTree);
  }

  if (newTree === null) {
    return notFoundAction(tree, value);
  }

  return newTree;
}

export function find<T, V = T>(
  tree: ImmutableTreeT<T> | null,
  value: V,
  cmp: (V, T) => number,
): ImmutableTreeT<T> | null {
  let cursor = tree;
  while (cursor !== null) {
    const order = cmp(value, cursor.value);
    if (order === 0) {
      break;
    } else if (order < 0) {
      cursor = cursor.left;
    } else {
      cursor = cursor.right;
    }
  }
  return cursor;
}

export function insert<T>(
  tree: ImmutableTreeT<T> | null,
  value: T,
  cmp: (T, T) => number,
  duplicateAction: TreeActionT<T>,
): ImmutableTreeT<T> {
  if (tree === null) {
    return {
      value,
      size: 1,
      left: null,
      right: null,
    };
  }

  const order = cmp(value, tree.value);

  if (order === 0) {
    return duplicateAction(tree, value);
  }

  const left = tree.left;
  const right = tree.right;

  if (order < 0) {
    const newLeftBranch = insert(left, value, cmp, duplicateAction);
    if (newLeftBranch === left) {
      return tree;
    }
    const newTree = {
      value: tree.value,
      size: newLeftBranch.size + (right === null ? 0 : right.size) + 1,
      left: newLeftBranch,
      right,
    };
    balanceLeft(newTree);
    return newTree;
  } else {
    const newRightBranch = insert(right, value, cmp, duplicateAction);
    if (newRightBranch === right) {
      return tree;
    }
    const newTree = {
      value: tree.value,
      size: (left === null ? 0 : left.size) + newRightBranch.size + 1,
      left,
      right: newRightBranch,
    };
    balanceRight(newTree);
    return newTree;
  }
}

export function* iterate<T>(
  tree: ImmutableTreeT<T> | null,
): Generator<T, void, void> {
  const stack = [];
  let cursor = tree;
  do {
    while (cursor !== null) {
      stack.push(cursor);
      cursor = cursor.left;
    }
    if (stack.length) {
      cursor = stack.pop();
      yield cursor.value;
      /*:: invariant(cursor); */
      cursor = cursor.right;
    }
  } while (stack.length || cursor !== null);
}
