# Changelog

## v0.14.0 (2025-07-10)

  * Added `isDisjointFrom`, which checks if `tree` is disjoint from `other`.

## v0.13.0 (2025-07-10)

  * Added `slice`, which works like `Array.prototype.slice`.
  * Added `isSubsetOf`, which checks if `tree` is a subset of `other`.
  * Added `isSupersetOf`, which checks if `tree` is a superset of `other`.
  * Fixed the return type of `findNode` to use `NonEmptyImmutableTree`.

## v0.12.0 (2025-07-10)

  * Added `findNode`, which returns the node in `tree` matching the given
    `key`.
  * Added `exists`, a convenience function that returns `true` if a value
    matching `key` exists in the tree, or `false` otherwise.
  * Added `symmetricDifference` to calculate the symmetric difference between
    two trees.

## v0.11.1 (2025-07-08)

  * Updated the TypeScript definitions and README.md for the `update` options
    argument changes in v0.11.0.
  * Fixed the type of `REMOVE_VALUE` in types/update.d.ts.
  * Added the date for the v0.11.0 release to CHANGELOG.md.

## v0.11.0 (2025-07-08)

  * `update` now takes a single options object as its second argument, with
     required properties `key`, `cmp`, `onConflict`, and `onNotFound`, and
     optional property `isEqual`, instead of separate positional arguments.
     All usages must be updated accordingly.
  * The optional `isEqual` option for `update` has been added. This is only
    run to determine if the value returned from `onConflict` is equal to the
    existing value in the tree. It defaults to `Object.is`, which matches the
    previous behavior.
  * `withKeyComparator` has been removed.
  * `remove` now takes a type parameter `K` and a `key` argument of type `K`,
    instead of the previous `value` argument. `key` may differ from the tree
    value type, similar to how `update` works.
  * The `empty` tree is no longer self-referencing in its `left` and `right`
    properties, which are now set to `null`. This allows for direct JSON
    serialization of trees again. The (unused) `empty.value` property is also
    set to `null` (instead of `undefined`).
  * `at` no longer throws, and accepts a `defaultValue` argument that is
    returned when `index` is out-of-bounds.
  * `union` and `intersection` now prefer values in `t1` rather than `t2`.
  * The `onConflictUseSecondValue` export has been removed from
    `weight-balanced-tree/union`.
  * The `useSecondValue` export has been removed from
    `weight-balanced-tree/intersection`.
  * Added `setIndex`, which replaces the value at a given index in a tree.
  * Added `splice`, which works like `Array.prototype.splice`.
  * Added `splitIndex` to split a tree by index rather than key.
  * Added `splitFirst` to split a tree into the first value and the rest.
  * Exposed and documented `splitLast`, which splits a tree into the last
    value and the rest.
  * Added a `SplitResult` type for the tuple return value of `split`. It's
    now read-only.
  * The comparator `cmp` passed to `split` now receives the index of the
    current tree node as its third argument.
  * Optimized `split` such that if `key < minValue(tree)` or
    `key > maxValue(tree)`, the same `tree` reference is returned as either
    `large` or `small`, respectively.
  * `iterate` and `reverseIterate` now use a stack rather than an array
    internally.
  * Exposed and documented `join` and `join2`.
  * Moved TypeScript types to the `types/` subdirectory.
  * Setup ESLint and fixed lint issues.

## v0.10.0 (2025-06-22)

  * Added `findWithIndex`, which combines `find` and `indexOf`.
  * Added `findAll`, which iterates over all values found using `key` and
    `cmp`. This is useful when `cmp` implements a left prefix of the
    comparator used to order `tree`.

## v0.9.0 (2025-06-16)

  * Added `split`, which splits a tree into two: one containing values
    smaller than `key`, and one containing values large than `key`,
    according to `cmp`.
  * `union` and `difference` are now implemented using join-based algorithms
    with a complexity of `O(m * log(n / m + 1))`.
  * `insert`, `update`, and `remove` have been simplified internally to use
    the join function. Their complexities haven't changed.
  * `ValueOrderError` now indicates whether parameters `v1` and `v2` should
    have been less than, greater than, or equal to each other.
  * Relaxed the situations in which `ValueOrderError` is thrown for `union`
    `onConflict` values. The returned value no longer has to have an
    identical sort order, as long as the final tree is valid.
  * Added `intersection`.
  * Added `filter`.
  * Added `onConflictRemoveValue`, which causes `update` to remove the value
    stored at `key` from `tree`.
  * Reimplemented `remove` using `update` and `onConflictRemoveValue`.
  * Refactoring and code cleanup.

## v0.8.0 (2025-06-13)

  * Empty trees are now represented by `empty` (a tree of size 0) rather
    than `null`. Many function type signatures were updated to reflect this.
  * Renamed `withComparator` to `withKeyComparator`.
    The passed-in comparator now compares keys of type `K`. A second
    argument is now required to retrieve `K` from `T`. This allows using
    `K` in `update`, `find`, `findNext`, `findPrev`, and `indexOf`.
  * Added `validate` to check if a tree is valid for a given comparator.
  * Changed the type signature of `equals` to allow comparing trees of
    different types.
  * Added `setBalancingParameters` (undocumented).
  * Added monkey tests for insert, remove, union, and difference.
  * Converted the tests from tape to the built-in Node test runner.
  * Minor code cleanup.

## v0.7.1 (2025-06-05)

  * Fixed the `exports` in package.json to let Flow find them again.
  * Fixed some entries in .npmignore for the changes in v0.7.0.
  * Fixed some broken links in README.md.

## v0.7.0 (2025-06-05)

  * Added `withComparator`, which returns an object with methods that have a
    `comparator` pre-bound.
  * Added `findBy`, which is like `find`, but omits the key parameter and
    passes a single tree value to `cmp`.  `cmp` can be a closure that
    compares against a key in its scope instead.
  * Added `indexOf` to find the position of a value in a tree.
  * Added `at` to find the value positioned at an index in a tree.
  * Added a `types` field to all `exports` in package.json, for better
    TypeScript compatibility.
  * Migrated the project to Yarn v4.
  * Upgraded Flow to 0.272.2.
  * Upgraded various other `devDependencies`.
  * Reorganized the source files to live under `src/`.
  * Renamed all files to use the `.js` extension (from `.mjs`).
    (`"type": "module"` had already been set in package.json.)

## v0.6.1 (2022-09-13)

  * The return type of `toArray` is no longer read-only.

## v0.6.0 (2022-08-25)

  * Changed the signature of `equals`.  It now accepts an `isEqual` function
    of type `<T>(T, T) => boolean` as the third argument instead of a
    comparator.  `isEqual` is optional: if not provided, it defaults to
    `Object.is`.
  * Changed `find`, `findNext`, and `findPrev` to return the found tree value
    directly instead of the tree branch containing the value.  These also now
    accept a default value to return if no tree value is found.

## v0.5.0 (2022-07-03)

  * Added `map` to replace all values in a tree using a `mapper` function.
  * Added `difference` to calculate the difference of two trees.

## v0.4.0 (2022-06-14)

  * Renamed `insertByKey` to `update` and moved it to update.mjs.
  * Moved all `onConflict*` helpers, and the types `InsertConflictHandler`
    and `InsertNotFoundHandler` to update.mjs.
  * Added `onNotFoundDoNothing`, which can be passed to `update` for the
    `onNotFound` argument where you only want to perform an update if the key
    already exists.
  * Changed the return type of `update` to include `null`, as it can now
    return `null` where the input tree is `null` and `onNotFoundDoNothing` is
    used.
  * Added `onNotFoundThrowError`, which throws a `ValueNotFoundError` if the
    key doesn't exist.
  * Documented `onNotFoundUseGivenValue` and exposed it for TypeScript.
  * Added `zip` to zip two trees together, returning an iterable of tuples.
  * Added `union` to merge two trees together.
  * Added `toArray` to flatten a tree into an array of values.
  * Improved the performance of `equals`.
  * Fixed a bug causing `insert` to return nodes with incorrect sizes when
    replacing a value.
  * Created error classes for each kind of error thrown by the module.
    Currently these are `ValueExistsError`, `ValueNotFoundError`, and
    `ValueOrderError`, and they're exported from errors.mjs.  The messages
    attached to the error instances have changed.
  * Removed the `onConflict` helper aliases `NOOP`, `REPLACE`, and `THROW`.
  * Defined the "exports" field in package.json.

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
