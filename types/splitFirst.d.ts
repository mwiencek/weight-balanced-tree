import {ImmutableTree, NonEmptyImmutableTree} from './types';

export default function splitFirst<T>(
  tree: NonEmptyImmutableTree<T>
): {
  readonly tree: ImmutableTree<T>;
  readonly value: T;
};
