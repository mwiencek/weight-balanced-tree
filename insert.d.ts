import type {ImmutableTree} from './types';
import type {InsertConflictHandler} from './update';

export default function insert<T>(
  tree: ImmutableTree<T> | null,
  value: T,
  cmp: (a: T, b: T) => number,
  onConflict?: InsertConflictHandler<T, T>,
): ImmutableTree<T>;

type InsertHelper = <T>(
  tree: ImmutableTree<T> | null,
  value: T,
  cmp: (a: T, b: T) => number,
) => ImmutableTree<T>;

export const insertIfNotExists: InsertHelper;
export const insertOrReplaceIfExists: InsertHelper;
export const insertOrThrowIfExists: InsertHelper;
