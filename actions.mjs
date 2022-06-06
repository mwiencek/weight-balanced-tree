// @flow strict

/*::
import type {SomeTreeAction} from './types.mjs';
*/

export const NOOP/*: SomeTreeAction */ =
  /*:: <T> */(existingTreeValue/*: T */)/*: T */ => existingTreeValue;

export const REPLACE/*: SomeTreeAction */ =
  /*:: <T> */(existingTreeValue/*: T */, value/*: T */)/*: T */ => value;

export const THROW/*: SomeTreeAction */ = () => {
  throw new Error('');
};
