# Changelog

## v0.3.0 (2022-06-08)

 * Added `insertByKey`, which allows for insertions using a key of type `K`
   instead of a value of type `T`.  It accepts an `onNotFound` handler which
   lets you lazily construct a `T` for insertion.
 * Added `equals` to determine if two trees contain the same values.
 * Added `fromDistinctAscArray`: given a sorted array of values, constructs
   a new balanced tree containing those values.
 * Fixed a bug in `remove` that caused a new tree to be returned if the value
   to remove didn't exist.
 * Renamed `duplicateAction` to `onConflict` in the typings and
   documentation.
 * Renamed the `TreeAction` type to `InsertConflictHandler` and moved it to
   insert.mjs.
 * Changed `onConflict` to receive the existing tree value as its first
   argument, rather than the node itself.
 * Removed `replaceWith`, which is no longer useful with the above change.
 * Added new aliases for the existing `onConflict` handlers `THROW`, `NOOP`,
   and `REPLACE`.  They're named `onConflictThrowError`,
   `onConflictKeepTreeValue`, and `onConflictUseGivenValue` respectively, and
   are exported from insert.mjs.  The previous aliases remain exported
   from index.mjs.
 * Made `onConflict` for `insert` default to `onConflictThrowError`.
 * Removed the `notFoundAction` argument from `remove`.  You can detect
   whether the value to remove isn't found based on whether the tree is
   modified.  There's no use to the feature that allows you to modify the
   tree via this function.

## v0.2.0 (2022-05-31)

 * Added `insertIfNotExists`, `insertOrReplaceIfExists`,
   and `insertOrThrowIfExists`.  These are the same as `insert`, but pass
   `NOOP`, `REPLACE`, or `THROW` for you, respectively.
 * Added `removeIfExists` and `removeOrThrowIfNotExists`.  Like above, these
   pass `NOOP` and `THROW` for you.
 * Added `create`: given a value, creates a tree of size 1 holding that
   value.  This is slightly more convenient than constructing the object
   yourself, as in `{value, left: null, right: null, size: 1}`.
 * Added `replaceWith` to simplify merging replacement values during an
   insertion.

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
