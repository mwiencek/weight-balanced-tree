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

export const NOOP: 1 = 1;
export const REPLACE: 2 = 2;
export const THROW: 3 = 3;

export type INSERT_DUPLICATE_ACTION<T> =
  | typeof NOOP
  | typeof REPLACE
  | typeof THROW
  | ((givenValue: T, existingValue: T) => T);

export type REMOVE_NOT_FOUND_ACTION =
  | typeof NOOP
  | typeof THROW;

export function getSize<T>(tree: ImmutableTreeT<T> | null): number {
  return tree === null ? 0 : tree.size;
}

function immutableRotateLeft<T>(a: ImmutableTreeT<T>): ImmutableTreeT<T> {
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
  return {
    value: b.value,
    size: left.size + getSize(c) + 1,
    left: left,
    right: c,
  };
}

function immutableRotateRight<T>(c: ImmutableTreeT<T>): ImmutableTreeT<T> {
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
  return {
    value: b.value,
    size: getSize(a) + right.size + 1,
    left: a,
    right: right,
  };
}

function mutableRotateLeft<T>(a: MutableTreeT<T>): void {
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
  a.size = left.size + getSize(c) + 1;
  a.left = left;
  a.right = c;
}

function mutableRotateRight<T>(c: MutableTreeT<T>): void {
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
  c.size = getSize(a) + right.size + 1;
  c.left = a;
  c.right = right;
}

function mutableRotateLeftRight<T>(tree: MutableTreeT<T>): void {
  /*:: invariant(tree.left); */
  tree.left = immutableRotateLeft(tree.left);
  mutableRotateRight(tree);
}

function mutableRotateRightLeft<T>(tree: MutableTreeT<T>): void {
  /*:: invariant(tree.right); */
  tree.right = immutableRotateRight(tree.right);
  mutableRotateLeft(tree);
}

function mutableBalanceLeft<T>(tree: MutableTreeT<T>): void {
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
      mutableRotateRight(tree);
    } else {
      mutableRotateLeftRight(tree);
    }
  }
}

function mutableBalanceRight<T>(tree: MutableTreeT<T>): void {
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
      mutableRotateLeft(tree);
    } else {
      mutableRotateRightLeft(tree);
    }
  }
}

export function remove<T>(
  tree: ImmutableTreeT<T> | null,
  value: T,
  cmp: (T, T) => number,
  notFoundAction?: REMOVE_NOT_FOUND_ACTION = NOOP,
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
    mutableBalanceLeft(newTree);
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
      mutableBalanceRight(newTree);
    }
  } else if (right !== null) {
    right = remove(right, value, cmp, notFoundAction);
    newTree = {
      value: tree.value,
      size: getSize(left) + getSize(right) + 1,
      left,
      right,
    };
    mutableBalanceLeft(newTree);
  }

  if (newTree === null) {
    switch (notFoundAction) {
      case NOOP:
        return tree;
      case THROW:
        throw new Error(
          'Failed to remove non-existent value: ' +
          String(value),
        );
      default:
        throw new Error(
          'Invalid REMOVE_NOT_FOUND_ACTION: ' +
          String(notFoundAction),
        );
    }
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
  duplicateAction?: INSERT_DUPLICATE_ACTION<T> = NOOP,
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
    switch (duplicateAction) {
      case NOOP:
        return tree;
      case REPLACE:
        return {
          value,
          size: tree.size,
          left: tree.left,
          right: tree.right,
        };
      case THROW:
        throw new Error(
          'Failed to insert duplicate value: ' +
          String(value),
        );
      default: {
        if (typeof duplicateAction === 'function') {
          return {
            value: duplicateAction(value, tree.value),
            size: tree.size,
            left: tree.left,
            right: tree.right,
          };
        }
        throw new Error(
          'Invalid INSERT_DUPLICATE_ACTION: ' +
          String(duplicateAction),
        );
      }
    }
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
    mutableBalanceLeft(newTree);
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
    mutableBalanceRight(newTree);
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
