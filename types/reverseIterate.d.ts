import type {ImmutableTree} from './types';

export default function reverseIterate<T>(
  tree: ImmutableTree<T>,
  start?: number,
  end?: number,
): Generator<T, undefined, undefined>;
