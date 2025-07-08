import type {ImmutableTree, NonEmptyImmutableTree} from './types';

export default function join<T>(
  left: ImmutableTree<T>,
  value: T,
  right: ImmutableTree<T>
): NonEmptyImmutableTree<T>;
