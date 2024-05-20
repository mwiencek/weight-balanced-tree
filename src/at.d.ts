import type {ImmutableTree} from './types';

export default function at<T>(
  tree: ImmutableTree<T>,
  index: number,
): T;
