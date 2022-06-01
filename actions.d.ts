import type {ImmutableTree, SomeTreeAction, TreeAction} from './types';

export const NOOP: SomeTreeAction;
export const REPLACE: SomeTreeAction;
export const THROW: SomeTreeAction;

export function replaceWith<T>(
  getValue: (oldValue: T, newValue: T) => T,
): TreeAction<T>;
