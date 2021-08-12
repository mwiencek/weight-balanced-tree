# Changelog

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
