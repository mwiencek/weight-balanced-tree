// @flow strict

import update, {
  onConflictKeepTreeValue,
  onConflictThrowError,
  onConflictUseGivenValue,
  onNotFoundUseGivenValue,
} from './update.js';
/*::
import invariant from './invariant.js';
import type {ImmutableTree} from './types.js';
import type {InsertConflictHandler} from './update.js';
*/

export default function insert/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
  onConflict/*:: ?: InsertConflictHandler<T, T> */ = onConflictThrowError,
)/*: ImmutableTree<T> */ {
  const result = update/*:: <T, T> */(
    tree,
    value,
    cmp,
    onConflict,
    onNotFoundUseGivenValue,
  );
  /*:: invariant(result); */
  return result;
}

export function insertIfNotExists/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
)/*: ImmutableTree<T> */ {
  const result = update/*:: <T, T> */(
    tree,
    value,
    cmp,
    onConflictKeepTreeValue,
    onNotFoundUseGivenValue,
  );
  /*:: invariant(result); */
  return result;
}

export function insertOrReplaceIfExists/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
)/*: ImmutableTree<T> */ {
  const result = update/*:: <T, T> */(
    tree,
    value,
    cmp,
    onConflictUseGivenValue,
    onNotFoundUseGivenValue,
  );
  /*:: invariant(result); */
  return result;
}

export function insertOrThrowIfExists/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
  value/*: T */,
  cmp/*: (a: T, b: T) => number */,
)/*: ImmutableTree<T> */ {
  const result = update/*:: <T, T> */(
    tree,
    value,
    cmp,
    onConflictThrowError,
    onNotFoundUseGivenValue,
  );
  /*:: invariant(result); */
  return result;
}
