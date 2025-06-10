import type {ImmutableTree} from './types';

export default function reverseIterate<T>(
  tree: ImmutableTree<T>,
): Generator<T, undefined, undefined>;
