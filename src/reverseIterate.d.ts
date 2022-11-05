import type {ImmutableTree} from './types';

export default function reverseIterate<T>(
  tree: ImmutableTree<T> | null,
): Generator<T, undefined, undefined>;
