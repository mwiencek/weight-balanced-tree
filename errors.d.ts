declare class ValueExistsError extends Error {
  constructor(value: unknown);
}

declare class ValueNotFoundError extends Error {
  constructor(value: unknown);
}

declare class ValueOrderError extends Error {
  constructor(expected: unknown, got: unknown);
}

export {
  ValueExistsError,
  ValueNotFoundError,
  ValueOrderError,
};
