import type {ImmutableTree} from './types';

export default function updateIndex<T>(
  tree: ImmutableTree<T>,
  index: number,
  updater: (existingTreeValue: T) => T,
): ImmutableTree<T>;
