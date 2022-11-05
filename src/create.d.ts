import type {ImmutableTree} from './types';

export default function create<T>(
  value: T,
): ImmutableTree<T>;
