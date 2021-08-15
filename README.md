# wbt-flow

Persistent weight-balanced (bounded balance) tree written in Flow (Flowtype).

References:

 1. Adams, Stephen.
    "Implementing Sets Efficiently in a Functional Language."
    University of Southampton, n.d.
    Accessed at http://groups.csail.mit.edu/mac/users/adams/BB/92-10.ps

 2. [GHC's Data.Map.Internal](https://gitlab.haskell.org/ghc/packages/containers/-/blob/f00aa02/containers/src/Data/Map/Internal.hs).

## Installation

`npm install wbt-flow` or `yarn add wbt-flow`.

## API

```
type ImmutableTreeT<+T> = {
  +value: T,
  +size: number,
  +left: ImmutableTreeT<T> | null,
  +right: ImmutableTreeT<T> | null,
};

type TreeActionT<T> =
  (tree: ImmutableTreeT<T>, value: T) => ImmutableTreeT<T>;
```

### insert

```
insert<T>(
    tree: ImmutableTreeT<T> | null,
    value: T,
    cmp: (T, T) => number,
    duplicateAction: TreeActionT<T>,
): ImmutableTree<T>;
```

Returns a new version of `tree` with `value` inserted.  The old version is not
modified.

The `cmp` (comparator) function is used to order the values.  This should never
change for a particular tree.  (It's recommended to create utility functions
for each type of tree that always pass the same comparator.)

`duplicateAction` is a function that determines what should happen when `value`
already exists in the tree.  This is required.  The passed-in function receives
the existing tree node that conflicts with `value` as its first argument, and
`value` as its second argument.  The return value is a tree node that replaces
the existing one if the reference is different.

There are several exports in the main module that can be used here:

 * `NOOP`, which just returns the node back unmodified.  In this case, `insert`
   will also return the tree root back unmodified.
 * `REPLACE`, which returns a new tree node with the value replaced.
 * `THROW`, which throws an exception.  It doesn't provide any meaningful error
   message, though, so you'd better write your own if needed.

### remove

```
remove<T>(
    tree: ImmutableTreeT<T> | null,
    value: T,
    cmp: (T, T) => number,
    notFoundAction: TreeActionT<T>,
): ImmutableTree<T> | null;
```

Returns a new version of `tree` with `value` removed.  The old version is not
modified.

If this was the last value in `tree`, `null` is returned (indicating an empty
tree).

The `cmp` (comparator) function is the same as used for `insert`.

The optional `notFoundAction` determines what should happen when `value`
is not found in the tree.  The default action, `NOOP`, returns `tree` back
unmodified.  The only other supported action is `THROW`, which throws an
exception.

`notFoundAction` is a function that determines what should happen when `value`
is not found in the tree.  This is required.  The passed-in function receives
the tree node where `remove` dead-ended as its first argument, and `value` as
its second argument.  The return value is a tree node that replaces the
dead-end one if the reference is different.

As for `insert` above, you can use these exports from the main module for
`notFoundAction`:

 * `NOOP`, which just returns the node back unmodified.  In this case, `remove`
   will also return the tree root back unmodified.
 * `THROW`, which throws an exception.

### find

```
find<T>(
    tree: ImmutableTreeT<T> | null,
    value: T,
    cmp: (T, T) => number,
): ImmutableTree<T> | null;
```

Finds the branch of `tree` containing `value` and returns it, or `null` if not
found.

The `cmp` (comparator) function is the same as used for `insert`.

### findNext

```
findNext<T, V = T>(
  tree: ImmutableTreeT<T> | null,
  value: V,
  cmp: (V, T) => number,
): ImmutableTreeT<T> | null;
```

Finds the branch of `tree` that follows `value` and returns it, or `null` if
there is no such node.  `value` does not have to exist in the tree: if a set
has 1 & 3, the next value from 2 is 3.

### findPrev

```
findNext<T, V = T>(
  tree: ImmutableTreeT<T> | null,
  value: V,
  cmp: (V, T) => number,
): ImmutableTreeT<T> | null;
```

Finds the branch of `tree` that precedes `value` and returns it, or `null` if
there is no such node.  `value` does not have to exist in the tree: if a set
has 1 & 3, the previous value from 2 is 1.

### iterate

```
iterate<T>(tree: ImmutableTreeT<T> | null): Generator<T, void, void>;
```

Returns a JS iterator that traverses the values of the tree in order.

### minValue

```
minValue<T>(tree: ImmutableTreeT<T>): T;
```

Returns the "smallest" (left-most) value in `tree`.

### maxValue

```
maxValue<T>(tree: ImmutableTreeT<T>): T;
```

Returns the "largest" (right-most) value in `tree`.

## Example

A tree always consists of at least one node with a value; an "empty" tree is
just `null`.

These can be used as maps or simple ordered lists.  Although there's only one
datum stored per node, for maps you can store a `[key, value]` tuple, or store
`key` directly on `value` if it's an object.


```JavaScript
import * as wbt from 'wbt-flow';

const compareInt = (a, b) => (a - b);
const insertInt = (list, int) => wbt.insert(list, int, compareInt);
const removeInt = (list, int) => wbt.remove(list, int, compareInt);

let list = null;
list = insertInt(list, 2); // list.size === 1
list = insertInt(list, 1); // list.size === 2

Array.from(wbt.iterate(list)); // [1, 2]

list = removeInt(list, 1); // list.size === 1
list = removeInt(list, 2); // list === null

```

## Performance

Performance will largely depend on the size of your data and the cost of your
comparator function.  [benchmark.mjs](benchmark.mjs) tests an ASCII table with
uniform-length string keys and a simple string comparator function.

Comparisons against plain objects and `Immutable.Map` from
[immutable-js](https://immutable-js.com/) are included.  If you're not using
the tree as a map, these numbers may be irrelevant, and are a bit
apples-to-oranges as only the tree allows traversing items in sorted order.


```
insertion (wbt-flow) x 32,676 ops/sec ±0.29% (93 runs sampled)
insertion (immutable-js Map.set) x 34,208 ops/sec ±1.63% (94 runs sampled)
insertion (plain object) x 1,953 ops/sec ±0.65% (96 runs sampled)
find/get (wbt-flow) x 72,919 ops/sec ±0.12% (94 runs sampled)
find/get (immutable-js Map.get) x 223,716 ops/sec ±0.23% (96 runs sampled)
find/get (plain object) x 228,418 ops/sec ±0.06% (95 runs sampled)
find/get (array find) x 11,018 ops/sec ±0.19% (95 runs sampled)
removal (wbt-flow) x 51,277 ops/sec ±0.66% (95 runs sampled)
removal (immutable-js Map.delete) x 35,322 ops/sec ±1.26% (95 runs sampled)
removal (plain object) x 286 ops/sec ±0.59% (90 runs sampled)
Fastest is find/get (plain object)
```

You can run `./build.sh && node benchmark.mjs` yourself.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
