import type {ImmutableTree} from './types';

export default function toArray<T>(
  tree: ImmutableTree<T> | null,
): ReadonlyArray<T>;
