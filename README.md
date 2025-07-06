# weight-balanced-tree

A [persistent](https://en.wikipedia.org/wiki/Persistent_data_structure)
weight-balanced ([bounded balance](https://en.wikipedia.org/wiki/Weight-balanced_tree))
tree for JavaScript.

 * Zero dependencies
 * Trees are plain objects
 * Usable as a persistent map or set
 * Works in Node.js and the browser
 * Flow and TypeScript definitions included

## Installation

This software is released under the
[MIT license](https://github.com/mwiencek/weight-balanced-tree/blob/master/LICENSE).

It's published on npm as [weight-balanced-tree](https://www.npmjs.com/package/weight-balanced-tree),

```sh
npm install weight-balanced-tree

# or using yarn
yarn add weight-balanced-tree
```

```TypeScript
import * as tree from 'weight-balanced-tree';

// or import functions directly
import insert from 'weight-balanced-tree/insert';
```

## API

All API functions are pure and side‑effect free; the tree structure is
treated as immutable and a structurally‑shared copy is returned when
modifications are required.

Many functions of this library require a comparator `cmp`, which
defines the ordering of the tree. It works in the
same way as the [comparator passed to `Array.prototype.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#comparefn).
Obviously, the comparator should be idempotent and behave consistently for a
particular tree, otherwise the tree can become invalid.

Having to pass `cmp` to many functions can be repetitive, so an (optional)
[withKeyComparator()](#withKeyComparator) utility exists to create a wrapper
around many API functions.

### empty

```TypeScript
const empty: EmptyImmutableTree;
```

The empty tree.

Note: The correct way to check if a tree is empty is with `tree.size === 0`.
The `empty` object reference won't be consistent across realms or in cases
where a tree is parsed from JSON.

### create()

```TypeScript
function create<T>(value: T): ImmutableTree<T>;
```

Creates a tree of size 1 containing `value`.

### fromDistinctAscArray()

```TypeScript
function fromDistinctAscArray<T>(
  array: $ReadOnlyArray<T>,
): ImmutableTree<T>;
```

Constructs a new weight-balanced tree from `array`. `array` must be sorted
and contain only distinct values. (This is faster than building the tree one
value at a time with [insert()](#insert).)

`fromDistinctAscArray` will create an *invalid* tree if `array` is not
sorted or contains duplicate values. You can check if a tree is valid using
[validate()](#validate).

### update()

```TypeScript
type InsertConflictHandler<T, K> =
  (existingTreeValue: T, key: K) => T;

type InsertNotFoundHandler<T, K> =
  (key: K) => T;

function update<T, K>(
    tree: ImmutableTree<T>,
    key: K,
    cmp: (key: K, treeValue: T) => number,
    onConflict: InsertConflictHandler<T, K>,
    onNotFound: InsertNotFoundHandler<T, K>,
): ImmutableTree<T>;
```

A flexible primitive that can insert, replace, and even remove values in
`tree`.

`key` is located using the comparator `cmp`, which receives the same `key`
as its first argument, and a value of type `T` from `tree` as its second
argument.

 * If `key` exists, `onConflict` is expected to return a final value to
   live at that position. It receives the existing tree value as its first
   argument, and `key` as its second argument.

   The returned value must have the same relative position in the tree as
   before, otherwise a `ValueOrderError` is thrown.

   If you return `existingTreeValue` from `onConflict`, `update` will
   return the same `tree` reference back. `Object.is` is used to determine
   value equality.

   There are several predefined exports in
   [`weight-balanced-tree/update`](https://github.com/mwiencek/weight-balanced-tree/blob/master/src/update.js)
   that can be used for `onConflict`:

    * `onConflictThrowError`, which throws `ValueExistsError`.
    * `onConflictKeepTreeValue`, which returns the existing tree value.
    * `onConflictUseGivenValue`, which returns `key`. (This is only usable
      in cases where `K` is a subtype of `T`.)
    * `onConflictRemoveValue`, which causes `update` to remove the value
      stored at `key` from `tree`.

 * If `key` doesn't exist, `onNotFound` is invoked to lazily create or
   reject the missing value. It only receives one argument: the `key` passed
   to `update`. Like `onConflict`, it's expected to return a value to be
   inserted or to throw an error.

   The following predefined exports in `weight-balanced-tree/update` can be
   used for `onNotFound`:

    * `onNotFoundUseGivenValue`, which returns `key`. (This is only usable
      in cases where `K` is a subtype of `T`.)
    * `onNotFoundDoNothing`, which causes `update` to perform no insertion
      and to return the same `tree` reference back.
    * `onNotFoundThrowError`, which throws a `ValueNotFoundError`.

`K` and `T` can be different types. That's convenient when using the tree
as a map:

```TypeScript
const cmp = (key1, [key2]) => key1 - key2;

// key = 1, value = 0
let node = tree.create([1, 0]);

// increments the value stored at key 1, or initializes it to 0
node = tree.update(node, 1, cmp,
  /* onConflict: */ (currentValue, key) => [key, currentValue + 1],
  /* onNotFound: */ (key) => [key, 0],
);
```

And here's a "find or insert" implementation:

```TypeScript
interface Item {
  readonly key: number;
  readonly value: string;
}

function compareKeyWithItemKey(key: number, item: Item): number {
  return key - item.key;
}

function findOrInsert(tree, key) {
  let item;
  const newTree = update<Item, number>(
    tree, key,
    compareKeyWithItemKey,
    (existingItem: Item) => {
      item = existingItem;
      return existingItem;
    },
    function onNotFound(key: number) {
      item = {key, value: 'initialValue'};
      return item;
    },
  );
  return [newTree, item];
}
```

For simpler insertion semantics, see [insert()](#insert) below.

### insert()

```TypeScript
function insert<T>(
    tree: ImmutableTree<T>,
    value: T,
    cmp: (T, T) => number,
    onConflict?: InsertConflictHandler<T, T>,
): NonEmptyImmutableTree<T>;
```

Returns a new version of `tree` with `value` inserted. This is a more
specific version of [update()](#update) that only operates on the value
type `T`.

`cmp` is the same as with `update`, except the first argument received
is the `value` you passed, and both arguments are of type `T`.

`onConflict` is also the same as with `update`, but here it defaults to
`onConflictThrowError` if not specified.

There are also some additional exports available that call `insert` with
different values of `onConflict` for you:

 * `insertIfNotExists` (passes `onConflictKeepTreeValue`)
 * `insertOrReplaceIfExists` (passes `onConflictUseGivenValue`)

`insertOrThrowIfExists` is an alias of `insert`.

### remove()

```TypeScript
function remove<T, K>(
    tree: ImmutableTree<T>,
    key: K,
    cmp: (key: K, treeValue: T) => number,
): ImmutableTree<T>;
```

Returns a new version of `tree` with the value located by `key` removed.

If `key` is not found in the tree, the same tree reference is returned
back.

If this was the last value in `tree`, `empty` is returned.

The `cmp` function works the same as with [update()](#update), with `key`
being passed as the first argument.

`removeIfExists` is an alias of `remove`.

### removeOrThrowIfNotExists()

Like [remove()](#remove), but throws an error if `value` does not exist
in the tree.

This simply checks if the tree returned from `remove` is the same
reference.

### equals()

```TypeScript
function equals<T, U = T>(
  a: ImmutableTree<T>,
  b: ImmutableTree<U>,
  isEqual?: (a: T, b: U) => boolean,
): boolean;
```

Returns `true` if two trees contain the same values in the same order, or
`false` otherwise.

This works by zipping the trees' values together, and passing each pair of
values to `isEqual`.

`isEqual` is optional. If not provided, it defaults to
[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

### filter()

```TypeScript
function filter<T>(
  tree: ImmutableTree<T>,
  predicate: (value: T) => boolean,
): ImmutableTree<T>;
```

Returns a tree containing only the values that satisfy `predicate`.

### find()

```TypeScript
function find<T, K = T, D = T>(
  tree: ImmutableTree<T>,
  key: K,
  cmp: (a: K, b: T) => number,
  defaultValue: D,
): T | D;
```

Finds a value in `tree` using the given `key` and returns it, or
`defaultValue` if not found.

`cmp` receives `key` as its first argument, and a value of type `T` from
`tree` as its second argument.

### findAll()

```TypeScript
function findAll<T, K = T>(
  tree: ImmutableTree<T>,
  key: K,
  cmp: (a: K, b: T) => number,
): Generator<T, void, void>;
```

Iterates over all values in `tree` found using the given `key`. This is useful
when `cmp` implements a left prefix of the comparator used to order `tree`.

```TypeScript
const cmp = (a, b) => a < b ? -1 : (a > b ? 1 : 0);

// The `.value` comparison is a left prefix of the tree comparator:
function compareValueAndIndex(a, b) {
  return cmp(a.value, b.value) || cmp(a.index, b.index);
}

let node = tree.fromDistinctAscArray([
  {value: 'A', index: 1},
  {value: 'B', index: 1},
  {value: 'C', index: 1},
]);
node = tree.insert(node, {value: 'B', index: 2}, compareValueAndIndex);
node = tree.insert(node, {value: 'B', index: 3}, compareValueAndIndex);

Array.from(
  tree.findAll(node, 'B', (key, obj) => cmp(key, obj.value)),
); /* => Returns:
[
  {value: 'B', index: 1},
  {value: 'B', index: 2},
  {value: 'B', index: 3},
] */
```

### findBy()

```TypeScript
function findBy<T, D = T>(
  tree: ImmutableTree<T>,
  cmp: (treeValue: T) => number,
  defaultValue: D,
): T | D;
```

Finds a value in `tree` and returns it, or `defaultValue` if not found.

`cmp` receives a value of type `T` from `tree` as its first argument.
This allows you to pass in a closure that compares `treeValue` against a
static key.

### findNext()

```TypeScript
function findNext<T, K = T, D = T>(
  tree: ImmutableTree<T>,
  key: K,
  cmp: (a: K, b: T) => number,
  defaultValue: D,
): T | D;
```

Finds a value in `tree` using the given `key` and returns the value
immediately after it, or `defaultValue` if there is no such value.

`key` does not have to be found in the tree: if a set has 1 & 3, the next
value from 2 is 3.

### findPrev()

```TypeScript
function findPrev<T, K = T, D = T>(
  tree: ImmutableTree<T>,
  key: K,
  cmp: (a: K, b: T) => number,
  defaultValue: D,
): T | D;
```

Finds a value in `tree` using the given `key` and returns the value
immediately before it, or `defaultValue` if there is no such value.

`key` does not have to be found in the tree: if a set has 1 & 3, the previous
value from 2 is 1.

### findWithIndex()

```TypeScript
function findWithIndex<T, K = T, D = T>(
  tree: ImmutableTree<T>,
  key: K,
  cmp: (a: K, b: T) => number,
  defaultValue: D,
): [value: T | D, index: number];
```

Combines [find()](#find) and [indexOf()](#indexOf). Finds a value and its
position in `tree` using the given `key`, and returns them as a tuple.
Returns `[defaultValue, -1]` if not found.

### validate()

```TypeScript
function validate<T>(
  tree: ImmutableTree<T>,
  cmp: (a: T, b: T) => number,
): ValidateResult<T>;
```

Returns a `ValidateResult<T>` indicating whether the given `tree` is valid
for the comparator `cmp`: all left subtree values are less than the parent
value, and all right subtrees values are greater than the parent value.

### indexOf()

```TypeScript
function indexOf<T, K = T>(
  tree: ImmutableTree<T>,
  key: K,
  cmp: (a: K, b: T) => number,
): number;
```

Returns the position of `key` in `tree`, or `-1` if not found.

### at()

```TypeScript
function at<T>(
  tree: ImmutableTree<T>,
  index: number,
): T;
```

Returns the value positioned at (0-based) `index` in `tree`. Negative indices
retrieve values from the end.

This is equivalent to `toArray(tree)[index]`, but doesn't create an
intermediary array, and locates `index` in `O(log n)`.

An out-of-bounds `index` will throw `IndexOutOfRangeError`.

### iterate()

```TypeScript
function iterate<T>(tree: ImmutableTree<T>): Generator<T, void, void>;
```

Returns a JS iterator that traverses the values of the tree in order.

### reverseIterate()

```TypeScript
function reverseIterate<T>(tree: ImmutableTree<T>): Generator<T, void, void>;
```

Returns a JS iterator that traverses the values of the tree in reverse order.

### map()

```TypeScript
function map<T, U>(tree: ImmutableTree<T>, mapper: (T) => U): ImmutableTree<U>;
```

Returns a new tree with every value passed through `mapper`.
The mapped values are assumed to have the same relative order as before.

```TypeScript
const numberTree = fromDistinctAscArray([1, 2, 3]);

const stringTree = map<number, string>(
  numberTree,
  (num: number) => String(num),
);
```

### minNode()

```TypeScript
function minNode<T>(tree: ImmutableTree<T>): NonEmptyImmutableTree<T>;
```

Returns the "smallest" (left-most) node in `tree`.

### minValue()

```TypeScript
function minValue<T>(tree: ImmutableTree<T>): T;
```

Returns the "smallest" (left-most) value in `tree`.

This is equivalent to `minNode(tree).value`.

### maxNode()

```TypeScript
function maxNode<T>(tree: ImmutableTree<T>): NonEmptyImmutableTree<T>;
```

Returns the "largest" (right-most) node in `tree`.

### maxValue()

```TypeScript
function maxValue<T>(tree: ImmutableTree<T>): T;
```

Returns the "largest" (right-most) value in `tree`.

This is equivalent to `maxNode(tree).value`.

### splice()

```TypeScript
function splice<T>(
  tree: ImmutableTree<T>,
  start: number,
  deleteCount: number,
  items: ImmutableTree<T>
): {
  readonly tree: ImmutableTree<T>,
  readonly deleted: ImmutableTree<T>,
};
```

Has the same arguments as [Array.prototype.splice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice).

Example:

```TypeScript
const tree = fromDistinctAscArray([1, 2, 3, 4, 5]);
const {tree: newTree, deleted} = splice(tree, 1, 2, fromDistinctAscArray([8, 9]));
// newTree: [1, 8, 9, 4, 5]
// deleted: [2, 3]
```

Time complexity: `O(log n + m)`, where `n` is the size of `tree`
and `m` is the size of `items`.

### split()

```TypeScript
function split<T, K = T>(
  tree: ImmutableTree<T>,
  key: K,
  cmp: (a: K, b: T) => number,
): [
  small: ImmutableTree<T>,
  equal: ImmutableTree<T>,
  large: ImmutableTree<T>,
];
```

Splits a tree into two: one containing values smaller than `key`, and one
containing values large than `key`, according to `cmp`.

If `key` exists in the tree, `equal` will reference the node in `tree`
containing `key`; otherwise it will equal the `empty` tree.

### splitIndex()

```TypeScript
function splitIndex<T>(
  tree: ImmutableTree<T>,
  index: number,
): [
  small: ImmutableTree<T>,
  equal: ImmutableTree<T>,
  large: ImmutableTree<T>,
];
```

This is similar to [`split()`](#split), but uses the position in the tree
rather than a key and comparator. Negative indices are not supported.

### splitLast()

```TypeScript
function splitLast<T>(tree: NonEmptyImmutableTree<T>): {
  readonly tree: ImmutableTree<T>;
  readonly value: T;
};
```

Removes the last value from a non-empty tree, and returns an object
containing that value and the remaining tree.

Example:

```TypeScript
const node = fromDistinctAscArray([1, 2, 3]);
const {tree: newNode, value} = splitLast(node);
// newNode: [1, 2]
// value: 3
```

Time complexity: `O(log n)`.

### toArray()

```TypeScript
function toArray<T>(
  tree: ImmutableTree<T>,
): Array<T>;
```

Flattens `tree` into an array of values.

### union()

```TypeScript
function union<T>(
  t1: ImmutableTree<T>,
  t2: ImmutableTree<T>,
  cmp: (a: T, b: T) => number,
  combiner?: (v1: T, v2: T) => T,
): ImmutableTree<T>;
```

Merges two trees together using the comparator `cmp`.

`combiner` handles the case where an equivalent value appears in both
trees, and is expected to return the final value to use in the union. If not
specified, by `union` will prefer values in `t1`. If you return a different
value, then the relative sort order must be preserved; otherwise
`ValueOrderError` is thrown.

### difference()

```TypeScript
function difference<T>(
  t1: ImmutableTree<T>,
  t2: ImmutableTree<T>,
  cmp: (a: T, b: T) => number,
): ImmutableTree<T>;
```

Returns a new tree with values in `t1` that aren't in `t2`, using the
comparator `cmp`.

### intersection()

```TypeScript
function intersection<T>(
  t1: ImmutableTree<T>,
  t2: ImmutableTree<T>,
  cmp: (a: T, b: T) => number,
  combiner?: (v1: T, v2: T) => T,
): ImmutableTree<T>;
```

Returns a new tree with values common to both `t1` and `t2`, using the
comparator `cmp`.

`combiner` determines which value is chosen; by default it returns the value
from the first tree, `t1`. If you return a different value, then the
relative sort order must be preserved; otherwise `ValueOrderError` is thrown.

### zip()

```TypeScript
function zip<T, U>(
  t1: ImmutableTree<T>,
  t2: ImmutableTree<U>,
): Generator<[T | void, U | void], void, void>;
```

Zips two trees together, returning an iterable of tuples: the first tuple
contains the first values of both trees, the second tuple contains the second
values of both trees, and so on. If the trees are of different sizes,
`undefined` is used within a tuple where a corresponding value is missing.

### withKeyComparator()

Returns an object with methods that have the passed `comparator` pre-bound.

The second argument is invoked on tree values before passing them to the
comparator.

```TypeScript
const integerTree = withKeyComparator(
  compareIntegers,
  identity,
);

let node = integerTree.insert(tree.create(1), 2);
node = integerTree.remove(node, 1);

const map = withKeyComparator(
  compareIntegers,
  ([key]) => key,
);

let node = map.insert(tree.empty, [1, 'A']);
node = map.find(node, 1);
```

Any function above that accepts a `cmp` argument is available.

## Performance

Performance will largely depend on the size of your data and the cost of your
comparator function. See the
[benchmark/](https://github.com/mwiencek/weight-balanced-tree/tree/master/benchmark)
folder for comparisons against [Immutable.js](https://immutable-js.com/)
and [mori](https://swannodette.github.io/mori/).

## Tests

```sh
# Unit tests
./node_modules/.bin/c8 node --test test/index.js

# Monkey tests
node --test test/monkey.js

# TypeScript tests
./node_modules/.bin/tsd src
```

## Changelog

See [CHANGELOG.md](https://github.com/mwiencek/weight-balanced-tree/blob/master/CHANGELOG.md).

## References

 1. Adams, Stephen.
    "Implementing Sets Efficiently in a Functional Language."
    University of Southampton, n.d.
    Accessed at http://groups.csail.mit.edu/mac/users/adams/BB/92-10.ps

 2. [GHC's Data.Map.Internal](https://gitlab.haskell.org/ghc/packages/containers/-/blob/f00aa02/containers/src/Data/Map/Internal.hs).

 3. [Join-based tree algorithms](https://en.wikipedia.org/wiki/Join-based_tree_algorithms)
