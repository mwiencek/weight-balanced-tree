import type {ImmutableTree} from './types';

export default function iterate<T>(
  tree: ImmutableTree<T> | null,
): Generator<T, undefined, undefined>;
