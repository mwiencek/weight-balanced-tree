import type {ImmutableTree} from './types';

export default function join2<T>(
  left: ImmutableTree<T>,
  right: ImmutableTree<T>
): ImmutableTree<T>;
