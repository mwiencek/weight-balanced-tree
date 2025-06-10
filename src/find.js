// @flow strict

/*::
import type {ImmutableTree} from './types.js';
*/
import findBy from './findBy.js';

export default function find/*:: <T, K = T, D = T> */(
  tree/*: ImmutableTree<T> */,
  key/*: K */,
  cmp/*: (a: K, b: T) => number */,
  defaultValue/*: D */,
)/*: T | D */ {
  return findBy/*:: <T, D> */(
    tree,
    (treeValue) => cmp(key, treeValue),
    defaultValue,
  );
}
