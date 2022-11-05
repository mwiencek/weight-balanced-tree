import type {ImmutableTree} from './types';

export default function equals<T>(
  a: ImmutableTree<T> | null,
  b: ImmutableTree<T> | null,
  isEqual?: (a: T, b: T) => boolean,
): boolean;
