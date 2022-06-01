# Changelog

## v0.2.0 (unreleased)

 * Added `insertIfNotExists`, `insertOrReplaceIfExists`,
   and `insertOrThrowIfExists`.  These are the same as `insert`, but pass
   `NOOP`, `REPLACE`, or `THROW` for you, respectively.
 * Added `removeIfExists` and `removeOrThrowIfNotExists`.  Like above, these
   pass `NOOP` and `THROW` for you.
 * Added `create`: given a value, creates a tree of size 1 holding that
   value.  This is slightly more convenient than constructing the object
   yourself, as in `{value, left: null, right: null, size: 1}`.

## v0.1.1 (2022-02-01)

 * Exported and documented `minNode` and `maxNode`.
 * Added `reverseIterate`.
 * Fixed some references to test.mjs.

## v0.1.0 (2021-10-23)

 * Renamed the package from `wbt-flow` to `weight-balanced-tree`.
 * Split the source code into separate modules.
 * Removed the 'T' suffix from type names.
 * Added TypeScript definitions.
 * Changed all Flow types to use comment-syntax, so that source files
   can be executed directly in Node.
 * Improved test coverage slightly (now 100%).

## v0.0.5 (2021-08-15)

 * Added `minValue` and `maxValue`.
 * Added `findNext` and `findPrev`.
 * Removed uses of the unclear `any` type.
 * Fixed Flow errors in test.mjs.
 * Added `"sideEffects": false` to package.json.

## v0.0.4 (2021-08-12)

 * Made `duplicateAction` and `notFoundAction` actually required.  (Removed
   the parameter defaults, which was also affecting the Flow types.)

## v0.0.3 (2021-08-11)

 * Changed the types of the `duplicateAction` parameter (on `insert`) and the
   `notFoundAction` parameter (on `remove`) to `TreeActionT<T>`, which is a
   simple function type.
 * Changed `NOOP`, `REPLACE`, and `THROW` from numeric constants to functions
   of type `TreeActionT`.
 * Made `duplicateAction` and `notFoundAction` required.
 * Reduced object allocations during balancing: one less per rotation.
 * Code cleanup.

## v0.0.2 (2021-08-08)

 * Added an optional `duplicateAction` parameter to `insert`.
 * Added an optional `notFoundAction` parameter to `remove`.
 * `insert` now returns the same tree back with `duplicateAction = NOOP`.
 * `remove` now returns the same tree back with `notFoundAction = NOOP`.
 * Removed benchmark.mjs from the published npm package.

## v0.0.1 (2021-08-08)

 * Initial release.
