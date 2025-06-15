// @flow strict

export class EmptyTreeError extends Error {
  constructor() {
    super('The tree is empty');
  }
}

export class IndexOutOfRangeError extends Error {
  constructor(value/*: mixed */) {
    super(
      'The given tree is out of range: ' +
      String(value),
    );
  }
}

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

/*::
export type ExpectedValueOrder =
  | 'less than'
  | 'greater than'
  | 'equal to';
*/

export class ValueOrderError extends Error {
  /*::
  +v1: mixed;
  +v2: mixed;
  +expectedOrder: ExpectedValueOrder;
  */

  constructor(
    v1/*: mixed */,
    v2/*: mixed */,
    expectedOrder/*: ExpectedValueOrder */,
  ) {
    super(
      'The relative order of values has changed: expected ' +
      String(v1) + ' to be ' +
      expectedOrder + ' ' +
      String(v2),
    );
    this.name = 'ValueOrderError';
    this.v1 = v1;
    this.v2 = v2;
    this.expectedOrder = expectedOrder;
  }
}
