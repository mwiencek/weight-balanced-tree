import type {ImmutableTree, NonEmptyImmutableTree} from './types';

export default function maxNode<T>(
  tree: ImmutableTree<T>,
): NonEmptyImmutableTree<T>;
