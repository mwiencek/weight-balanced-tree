import type {ImmutableTree} from './types';

export default function equals<T, U = T>(
  a: ImmutableTree<T> | null,
  b: ImmutableTree<U> | null,
  isEqual?: (a: T, b: U) => boolean,
): boolean;
