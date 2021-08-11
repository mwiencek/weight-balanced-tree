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

// $FlowIgnore[unclear-type]
export const NOOP: TreeActionT<any> = (tree) => tree;

// $FlowIgnore[unclear-type]
export const REPLACE: TreeActionT<any> = (tree, value) => ({
  value,
  size: tree.size,
  left: tree.left,
  right: tree.right,
});

// $FlowIgnore[unclear-type]
export const THROW: TreeActionT<any> = () => {
  throw new Error('');
};

export function getSize<T>(tree: ImmutableTreeT<T> | null): number {
  return tree === null ? 0 : tree.size;
}

function rotateLeft<T>(a: MutableTreeT<T>): void {
  const b = a.right;
  /*:: invariant(b); */
  const c = b.right;
  /*:: invariant(c); */
  const left = {
    value: a.value,
    size: getSize(a.left) + getSize(b.left) + 1,
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
    size: getSize(b.right) + getSize(c.right) + 1,
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
    size: getSize(a.left) + getSize(b.left) + 1,
    left: a.left,
    right: b.left,
  };
  const right = {
    value: tree.value,
    size: getSize(c) + getSize(tree.right) + 1,
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
    size: getSize(b.right) + getSize(c.right) + 1,
    left: b.right,
    right: c.right,
  };
  const left = {
    value: tree.value,
    size: getSize(tree.left) + getSize(a) + 1,
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
  const leftSize = getSize(left);
  const rightSize = getSize(right);

  if ((leftSize + rightSize) < 2) {
    return;
  }

  if (leftSize > (DELTA * rightSize)) {
    /*:: invariant(left); */
    if (getSize(left.right) < (RATIO * getSize(left.left))) {
      rotateRight(tree);
    } else {
      rotateLeftRight(tree);
    }
  }
}

function balanceRight<T>(tree: MutableTreeT<T>): void {
  const left = tree.left;
  const right = tree.right;
  const leftSize = getSize(left);
  const rightSize = getSize(right);

  if ((leftSize + rightSize) < 2) {
    return;
  }

  if (rightSize > (DELTA * leftSize)) {
    /*:: invariant(right); */
    if (getSize(right.left) < (RATIO * getSize(right.right))) {
      rotateLeft(tree);
    } else {
      rotateRightLeft(tree);
    }
  }
}

export function remove<T>(
  tree: ImmutableTreeT<T> | null,
  value: T,
  cmp: (T, T) => number,
  notFoundAction: TreeActionT<T> = NOOP,
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
    let minTree = tree.right;
    while (minTree.left) {
      minTree = minTree.left;
    }
    newTree = {
      value: minTree.value,
      size: tree.size - 1,
      left: tree.left,
      right: remove(tree.right, minTree.value, cmp, THROW),
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
        size: getSize(left) + getSize(right) + 1,
        left,
        right,
      };
      balanceRight(newTree);
    }
  } else if (right !== null) {
    right = remove(right, value, cmp, notFoundAction);
    newTree = {
      value: tree.value,
      size: getSize(left) + getSize(right) + 1,
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
  duplicateAction: TreeActionT<T> = NOOP,
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
  let newTree: MutableTreeT<T> | null = null;

  if (order < 0) {
    const newLeftBranch = insert(left, value, cmp, duplicateAction);
    if (newLeftBranch === left) {
      return tree;
    }
    newTree = {
      value: tree.value,
      size: newLeftBranch.size + getSize(right) + 1,
      left: newLeftBranch,
      right,
    };
    balanceLeft(newTree);
  } else {
    const newRightBranch = insert(right, value, cmp, duplicateAction);
    if (newRightBranch === right) {
      return tree;
    }
    newTree = {
      value: tree.value,
      size: getSize(left) + newRightBranch.size + 1,
      left,
      right: newRightBranch,
    };
    balanceRight(newTree);
  }

  return newTree;
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
