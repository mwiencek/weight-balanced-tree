import type {ImmutableTree} from './types';

export default function findBy<T, D = T>(
  tree: ImmutableTree<T>,
  cmp: (treeValue: T) => number,
  defaultValue: D,
): T | D;
