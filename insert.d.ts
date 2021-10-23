import type {ImmutableTree, TreeAction} from './types';

export default function insert<T>(
  tree: ImmutableTree<T> | null,
  value: T,
  cmp: (a: T, b: T) => number,
  duplicateAction: TreeAction<T>,
): ImmutableTree<T>;
