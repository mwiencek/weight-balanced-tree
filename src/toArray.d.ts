import type {ImmutableTree} from './types';

export default function toArray<T>(
  tree: ImmutableTree<T>,
): Array<T>;
