import type {ImmutableTree} from './types';

export default function isSubsetOf<T>(
  tree: ImmutableTree<T>,
  other: ImmutableTree<T>,
  cmp: (a: T, b: T) => number,
): boolean;
