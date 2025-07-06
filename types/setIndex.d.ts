import type {ImmutableTree} from './types';

export default function setIndex<T>(
  tree: ImmutableTree<T>,
  index: number,
  value: T,
): ImmutableTree<T>;
