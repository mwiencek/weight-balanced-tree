# Changelog

## v0.0.2 (2021-08-08)

 * Added an optional `duplicateAction` parameter to `insert`.
 * Added an optional `notFoundAction` parameter to `remove`.
 * `insert` now returns the same tree back with `duplicateAction = NOOP`.
 * `remove` now returns the same tree back with `notFoundAction = NOOP`.
 * Removed benchmark.mjs from the published npm package.

## v0.0.1 (2021-08-08)

 * Initial release.
