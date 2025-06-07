import type {ImmutableTree} from './types';

export type ValidateResult<T> =
  | {readonly valid: true}
  | {
      readonly valid: false,
      readonly tree: ImmutableTree<T>,
      readonly subtree: 'left' | 'right',
    };

export default function validate<T>(
  tree: ImmutableTree<T> | null,
  cmp: (a: T, b: T) => number,
): ValidateResult<T>;
