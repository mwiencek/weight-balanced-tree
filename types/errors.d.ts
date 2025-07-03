declare class ValueExistsError extends Error {
  constructor(value: unknown);
}

declare class ValueNotFoundError extends Error {
  constructor(value: unknown);
}

export type ExpectedValueOrder =
  | 'less than'
  | 'greater than'
  | 'equal to';

declare class ValueOrderError extends Error {
  constructor(
    v1: unknown,
    v2: unknown,
    expectedOrder: ExpectedValueOrder,
  );
}

export {
  ValueExistsError,
  ValueNotFoundError,
  ValueOrderError,
};
