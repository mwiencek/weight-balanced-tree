import type {ImmutableTree} from './types';

export default function iterate<T>(
  tree: ImmutableTree<T>,
): Generator<T, undefined, undefined>;
