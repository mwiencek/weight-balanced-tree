// @flow strict

import create from './create.js';
import empty from './empty.js';
import {
  ValueExistsError,
  ValueNotFoundError,
  ValueOrderError,
} from './errors.js';
import join from './join.js';
/*::
import invariant from './invariant.js';
import type {ImmutableTree} from './types.js';

export type InsertConflictHandler<T, K> =
  (existingTreeValue: T, key: K) => T;

export type InsertNotFoundHandler<T, K> =
  (key: K) => T;
*/

export function onConflictThrowError()/*: empty */ {
  // If this is expected, provide your own `onConflict` handler.
  throw new ValueExistsError();
}

export function onConflictKeepTreeValue/*:: <T, K> */(
  treeValue/*: T */,
  givenValue/*: K */,
)/*: T */ {
  return treeValue;
}

export function onConflictUseGivenValue/*:: <T> */(
  treeValue/*: T */,
  givenValue/*: T */,
)/*: T */ {
  return givenValue;
}

const DO_NOTHING_SYMBOL = Symbol('DO_NOTHING');

export function onNotFoundDoNothing(
  givenValue/*: mixed */,
)/*: empty */ {
  throw DO_NOTHING_SYMBOL;
}

export function onNotFoundThrowError()/*: empty */ {
  throw new ValueNotFoundError();
}

export function onNotFoundUseGivenValue/*:: <T> */(
  givenValue/*: T */,
)/*: T */ {
  return givenValue;
}

export default function update/*:: <T, K> */(
  tree/*: ImmutableTree<T> */,
  key/*: K */,
  cmp/*: (key: K, treeValue: T) => number */,
  onConflict/*: InsertConflictHandler<T, K> */,
  onNotFound/*: InsertNotFoundHandler<T, K> */,
)/*: ImmutableTree<T> */ {
  if (tree.size === 0) {
    let valueToInsert;
    try {
      valueToInsert = onNotFound(key);
    } catch (error) {
      if (error === DO_NOTHING_SYMBOL) {
        // This is the only case where `update` can return `empty`.
        return empty;
      }
      throw error;
    }
    if (!Object.is(valueToInsert, key) && cmp(key, valueToInsert) !== 0) {
      throw new ValueOrderError(key, valueToInsert, 'equal to');
    }
    return create(valueToInsert);
  }

  const order = cmp(key, tree.value);

  if (order === 0) {
    const valueToInsert = onConflict(tree.value, key);
    if (Object.is(valueToInsert, tree.value)) {
      return tree;
    } else if (cmp(key, valueToInsert) !== 0) {
      throw new ValueOrderError(key, valueToInsert, 'equal to');
    }
    return {
      left: tree.left,
      right: tree.right,
      size: tree.size,
      value: valueToInsert,
    };
  }

  if (order < 0) {
    const newLeftBranch = update(tree.left, key, cmp, onConflict, onNotFound);
    if (newLeftBranch.size === 0 || newLeftBranch === tree.left) {
      return tree;
    }
    return join(newLeftBranch, tree.value, tree.right);
  } else {
    const newRightBranch = update(tree.right, key, cmp, onConflict, onNotFound);
    if (newRightBranch.size === 0 || newRightBranch === tree.right) {
      return tree;
    }
    return join(tree.left, tree.value, newRightBranch);
  }
}
