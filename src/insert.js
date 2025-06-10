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
  const result = update/*:: <T, T> */(
    tree,
    value,
    cmp,
    onConflict,
    onNotFoundUseGivenValue,
  );
  /*:: invariant(result.size !== 0); */
  return result;
}

export function insertIfNotExists/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
)/*: NonEmptyImmutableTree<T> */ {
  const result = update/*:: <T, T> */(
    tree,
    value,
    cmp,
    onConflictKeepTreeValue,
    onNotFoundUseGivenValue,
  );
  /*:: invariant(result.size !== 0); */
  return result;
}

export function insertOrReplaceIfExists/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
)/*: NonEmptyImmutableTree<T> */ {
  const result = update/*:: <T, T> */(
    tree,
    value,
    cmp,
    onConflictUseGivenValue,
    onNotFoundUseGivenValue,
  );
  /*:: invariant(result.size !== 0); */
  return result;
}

export function insertOrThrowIfExists/*:: <T> */(
  tree/*: ImmutableTree<T> */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
)/*: NonEmptyImmutableTree<T> */ {
  const result = update/*:: <T, T> */(
    tree,
    value,
    cmp,
    onConflictThrowError,
    onNotFoundUseGivenValue,
  );
  /*:: invariant(result.size !== 0); */
  return result;
}
