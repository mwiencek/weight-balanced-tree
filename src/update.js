// @flow strict

import create, {node} from './create.js';
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
  (key: K) => T | DoNothing;
*/

class DoNothing {}
Object.freeze(DoNothing);
Object.freeze(DoNothing.prototype);

export const DO_NOTHING/*: DoNothing */ = Object.freeze(new DoNothing());

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

export function onNotFoundDoNothing(
  givenValue/*: mixed */,
)/*: DoNothing */ {
  return DO_NOTHING;
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
    const valueToInsert = onNotFound(key);
    if (valueToInsert === DO_NOTHING) {
      // This is the only case where `update` can return `empty`.
      return empty;
    }
    /*:: invariant(!(valueToInsert instanceof DoNothing)); */
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
    return node(tree.left, valueToInsert, tree.right);
  }

  if (order < 0) {
    const newLeftBranch = update(tree.left, key, cmp, onConflict, onNotFound);
    if (newLeftBranch === tree.left) {
      return tree;
    }
    return join(newLeftBranch, tree.value, tree.right);
  } else {
    const newRightBranch = update(tree.right, key, cmp, onConflict, onNotFound);
    if (newRightBranch === tree.right) {
      return tree;
    }
    return join(tree.left, tree.value, newRightBranch);
  }
}
