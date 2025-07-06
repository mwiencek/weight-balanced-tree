import type {ImmutableTree} from './types';

export default function at<T, D = T>(
  tree: ImmutableTree<T>,
  index: number,
  defaultValue?: D,
): T | D;
