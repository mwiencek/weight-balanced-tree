import type {ImmutableTree} from './types';

export default function isSupersetOf<T>(
  tree: ImmutableTree<T>,
  other: ImmutableTree<T>,
  cmp: (a: T, b: T) => number,
): boolean;
