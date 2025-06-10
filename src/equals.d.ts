import type {ImmutableTree} from './types';

export default function equals<T, U = T>(
  a: ImmutableTree<T>,
  b: ImmutableTree<U>,
  isEqual?: (a: T, b: U) => boolean,
): boolean;
