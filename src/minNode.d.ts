import type {ImmutableTree, NonEmptyImmutableTree} from './types';

export default function minNode<T>(
  tree: ImmutableTree<T>,
): NonEmptyImmutableTree<T>;
