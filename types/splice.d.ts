import type {ImmutableTree} from './types';

export type SpliceResult<T> = {
  readonly tree: ImmutableTree<T>;
  readonly deleted: ImmutableTree<T>;
};

export default function splice<T>(
  tree: ImmutableTree<T>,
  start: number,
  deleteCount: number,
  items: ImmutableTree<T>
): SpliceResult<T>;
