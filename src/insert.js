// @flow strict

import update, {
  onConflictKeepTreeValue,
  onConflictThrowError,
  onConflictUseGivenValue,
  onNotFoundUseGivenValue,
} from './update.js';
/*::
import invariant from './invariant.js';
import type {ImmutableTree, NonEmptyImmutableTree} from './types.js';
import type {InsertConflictHandler} from './update.js';
*/

export default function insert/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
  onConflict/*:: ?: InsertConflictHandler<T, T> */ = onConflictThrowError,
)/*: NonEmptyImmutableTree<T> */ {
  const result = update/*:: <T, T> */(tree, {
    key: value,
    cmp,
    onConflict,
    onNotFound: onNotFoundUseGivenValue,
  });
  /*:: invariant(result.size !== 0); */
  return result;
}

export function insertIfNotExists/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
)/*: NonEmptyImmutableTree<T> */ {
  const result = update/*:: <T, T> */(tree, {
    key: value,
    cmp,
    onConflict: onConflictKeepTreeValue,
    onNotFound: onNotFoundUseGivenValue,
  });
  /*:: invariant(result.size !== 0); */
  return result;
}

export function insertOrReplaceIfExists/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
)/*: NonEmptyImmutableTree<T> */ {
  const result = update/*:: <T, T> */(tree, {
    key: value,
    cmp,
    onConflict: onConflictUseGivenValue,
    onNotFound: onNotFoundUseGivenValue,
  });
  /*:: invariant(result.size !== 0); */
  return result;
}

export function insertOrThrowIfExists/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
)/*: NonEmptyImmutableTree<T> */ {
  const result = update/*:: <T, T> */(tree, {
    key: value,
    cmp,
    onConflict: onConflictThrowError,
    onNotFound: onNotFoundUseGivenValue,
  });
  /*:: invariant(result.size !== 0); */
  return result;
}
