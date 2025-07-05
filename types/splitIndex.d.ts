import type {SplitResult} from './split';
import type {ImmutableTree} from './types';

export default function splitIndex<T, K = T>(
  tree: ImmutableTree<T>,
  index: number,
): SplitResult<T>;
