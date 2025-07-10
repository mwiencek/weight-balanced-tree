import type {ImmutableTree} from './types';

export default function slice<T>(
  tree: ImmutableTree<T>,
  start?: number,
  end?: number,
): ImmutableTree<T>;
