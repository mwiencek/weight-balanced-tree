// @flow strict

import {ValueOrderError} from './errors.mjs';

export default function checkOrder/*:: <T, U> */(
  expected/*: T */,
  got/*: U */,
  cmp/*: (T, U) => number */,
)/*: void */ {
  if (cmp(expected, got) !== 0) {
    throw new ValueOrderError(expected, got);
  }
}
