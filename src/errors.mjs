// @flow strict

export class ValueExistsError extends Error {
  constructor(value/*: mixed */) {
    super(
      'The given value already exists in the tree: ' +
      String(value),
    );
  }
}

export class ValueNotFoundError extends Error {
  constructor(value/*: mixed */) {
    super(
      'The given value was not found in the tree: ' +
      String(value),
    );
  }
}

export class ValueOrderError extends Error {
  constructor(expected/*: mixed */, got/*: mixed */) {
    super(
      'The expected order of the value has changed: ' +
      String(expected) + ' (expected) ' +
      'vs. ' +
      String(got) + ' (got)',
    );
  }
}
