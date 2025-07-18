// @flow strict

import create, {node} from './create.js';
import empty from './empty.js';
import {
  ValueExistsError,
  ValueNotFoundError,
  ValueOrderError,
} from './errors.js';
import join from './join.js';
import join2 from './join2.js';
/*::
import invariant from './invariant.js';
import type {ImmutableTree, NonEmptyImmutableTree} from './types.js';

export type InsertConflictHandler<T, K> =
  (existingTreeValue: T, key: K) => T | RemoveValue;

export type InsertNotFoundHandler<T, K> =
  (key: K) => T | DoNothing;

export type UpdateOptions<T, K> = {
  key: K,
  cmp: (key: K, treeValue: T) => number,
  isEqual?: (a: T, b: T) => boolean,
  onConflict: InsertConflictHandler<T, K>,
  onNotFound: InsertNotFoundHandler<T, K>,
};
*/

export class DoNothing {}
Object.freeze(DoNothing);
Object.freeze(DoNothing.prototype);

export class RemoveValue {}
Object.freeze(RemoveValue);
Object.freeze(RemoveValue.prototype);

export const DO_NOTHING/*: DoNothing */ = Object.freeze(new DoNothing());
export const REMOVE_VALUE/*: RemoveValue */ = Object.freeze(new RemoveValue());

export function onConflictThrowError()/*: empty */ {
  // If this is expected, provide your own `onConflict` handler.
  throw new ValueExistsError();
}

export function onConflictKeepTreeValue/*:: <T, K> */(
  treeValue/*: T */
)/*: T */ {
  return treeValue;
}

export function onConflictUseGivenValue/*:: <T> */(
  treeValue/*: T */,
  givenValue/*: T */,
)/*: T */ {
  return givenValue;
}

export function onConflictRemoveValue()/*: RemoveValue */ {
  return REMOVE_VALUE;
}

export function onNotFoundDoNothing()/*: DoNothing */ {
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

function updateLeft/*:: <T> */(
  tree/*: NonEmptyImmutableTree<T> */,
  left/*: ImmutableTree<T> */,
)/*: NonEmptyImmutableTree<T> */ {
  return left === tree.left ? tree : join(left, tree.value, tree.right);
}

function updateRight/*:: <T> */(
  tree/*: NonEmptyImmutableTree<T> */,
  right/*: ImmutableTree<T> */,
)/*: NonEmptyImmutableTree<T> */ {
  return right === tree.right ? tree : join(tree.left, tree.value, right);
}

function _update/*:: <T, K> */(
  tree/*: ImmutableTree<T> */,
  key/*: K */,
  cmp/*: (key: K, treeValue: T) => number */,
  onConflict/*: InsertConflictHandler<T, K> */,
  onNotFound/*: InsertNotFoundHandler<T, K> */,
  isEqual/*: (a: T, b: T) => boolean */,
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
    if (valueToInsert === REMOVE_VALUE) {
      return join2(tree.left, tree.right);
    }
    /*:: invariant(!(valueToInsert instanceof RemoveValue)); */
    if (isEqual(valueToInsert, tree.value)) {
      return tree;
    } else if (cmp(key, valueToInsert) !== 0) {
      throw new ValueOrderError(key, valueToInsert, 'equal to');
    }
    return node(tree.left, valueToInsert, tree.right);
  } else if (order < 0) {
    return updateLeft(
      tree,
      _update(tree.left, key, cmp, onConflict, onNotFound, isEqual),
    );
  } else {
    return updateRight(
      tree,
      _update(tree.right, key, cmp, onConflict, onNotFound, isEqual),
    );
  }
}

export default function update/*:: <T, K> */(
  tree/*: ImmutableTree<T> */,
  options/*: UpdateOptions<T, K> */,
)/*: ImmutableTree<T> */ {
  return _update(
    tree,
    options.key,
    options.cmp,
    options.onConflict,
    options.onNotFound,
    // $FlowIssue[method-unbinding]
    options.isEqual ?? Object.is,
  );
}
