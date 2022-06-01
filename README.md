# weight-balanced-tree

A persistent weight-balanced (bounded balance) tree.

References:

 1. Adams, Stephen.
    "Implementing Sets Efficiently in a Functional Language."
    University of Southampton, n.d.
    Accessed at http://groups.csail.mit.edu/mac/users/adams/BB/92-10.ps

 2. [GHC's Data.Map.Internal](https://gitlab.haskell.org/ghc/packages/containers/-/blob/f00aa02/containers/src/Data/Map/Internal.hs).

Written in Flow, but TypeScript definitions are included too.

## Installation

`npm install weight-balanced-tree` or `yarn add weight-balanced-tree`.

## API

```
type ImmutableTree<+T> = {
  +value: T,
  +size: number,
  +left: ImmutableTree<T> | null,
  +right: ImmutableTree<T> | null,
};

type TreeAction<T> =
  (tree: ImmutableTree<T>, value: T) => ImmutableTree<T>;
```

### insert

```
insert<T>(
    tree: ImmutableTree<T> | null,
    value: T,
    cmp: (T, T) => number,
    duplicateAction: TreeAction<T>,
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

The helper functions `insertIfNotExists`, `insertOrReplaceIfExists`,
and `insertOrThrowIfExists` are also exported; these call `insert` with
`NOOP`, `REPLACE`, or `THROW` for `duplicateAction`, respectively.

### remove

```
remove<T>(
    tree: ImmutableTree<T> | null,
    value: T,
    cmp: (T, T) => number,
    notFoundAction: TreeAction<T>,
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
    tree: ImmutableTree<T> | null,
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
  tree: ImmutableTree<T> | null,
  value: V,
  cmp: (V, T) => number,
): ImmutableTree<T> | null;
```

Finds the branch of `tree` that follows `value` and returns it, or `null` if
there is no such node.  `value` does not have to exist in the tree: if a set
has 1 & 3, the next value from 2 is 3.

### findPrev

```
findNext<T, V = T>(
  tree: ImmutableTree<T> | null,
  value: V,
  cmp: (V, T) => number,
): ImmutableTree<T> | null;
```

Finds the branch of `tree` that precedes `value` and returns it, or `null` if
there is no such node.  `value` does not have to exist in the tree: if a set
has 1 & 3, the previous value from 2 is 1.

### iterate

```
iterate<T>(tree: ImmutableTree<T> | null): Generator<T, void, void>;
```

Returns a JS iterator that traverses the values of the tree in order.

### reverseIterate

```
reverseIterate<T>(tree: ImmutableTree<T> | null): Generator<T, void, void>;
```

Returns a JS iterator that traverses the values of the tree in reverse order.

### minNode

```
minNode<T>(tree: ImmutableTree<T>): ImmutableTree<T>;
```

Returns the "smallest" (left-most) node in `tree`.

### minValue

```
minValue<T>(tree: ImmutableTree<T>): T;
```

Returns the "smallest" (left-most) value in `tree`.

This is equivalent to `minNode(tree).value`.

### maxNode

```
maxNode<T>(tree: ImmutableTree<T>): ImmutableTree<T>;
```

Returns the "largest" (right-most) node in `tree`.

### maxValue

```
maxValue<T>(tree: ImmutableTree<T>): T;
```

Returns the "largest" (right-most) value in `tree`.

This is equivalent to `maxNode(tree).value`.

## Example

A tree always consists of at least one node with a value; an "empty" tree is
just `null`.

These can be used as maps or simple ordered lists.  Although there's only one
datum stored per node, for maps you can store a `[key, value]` tuple, or store
`key` directly on `value` if it's an object.


```JavaScript
import * as wbt from 'weight-balanced-tree';

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

Comparisons against plain objects, [Immutable.Map](https://immutable-js.com/),
and [hamt_plus](https://github.com/mattbierner/hamt_plus) are included.
Please note that this is testing the weight-balanced tree *as a map*.  The
tree is of course ordered, while these other data structures cannot keep a
list of items in order.  However, I thought it would still be interesting to
see how it can perform against unordered collections in that respect.


```
insertion (weight-balanced-tree) x 32,667 ops/sec ±0.44% (91 runs sampled)
insertion (immutable-js Map.set) x 33,330 ops/sec ±0.85% (99 runs sampled)
insertion (hamt_plus) x 36,974 ops/sec ±0.14% (96 runs sampled)
insertion (hamt_plus with mutation) x 59,840 ops/sec ±0.94% (94 runs sampled)
insertion (plain object) x 1,955 ops/sec ±0.68% (96 runs sampled)
insertion (plain object with mutation) x 85,843 ops/sec ±0.80% (95 runs sampled)

find/get (weight-balanced-tree) x 59,212 ops/sec ±0.20% (96 runs sampled)
find/get (immutable-js Map.get) x 166,634 ops/sec ±0.76% (97 runs sampled)
find/get (hamt_plus) x 224,289 ops/sec ±0.17% (98 runs sampled)
find/get (plain object) x 212,563 ops/sec ±0.49% (92 runs sampled)
find/get (array find) x 9,590 ops/sec ±0.39% (93 runs sampled)

removal (weight-balanced-tree) x 53,767 ops/sec ±1.15% (96 runs sampled)
removal (hamt_plus) x 34,228 ops/sec ±1.35% (96 runs sampled)
removal (hamt_plus with transaction) x 45,077 ops/sec ±0.40% (98 runs sampled)
removal (immutable-js Map.delete) x 32,387 ops/sec ±0.23% (93 runs sampled)
removal (plain object) x 274 ops/sec ±0.89% (92 runs sampled)
```

You can run `node benchmark.mjs` yourself.

## Tests

Run `./node_modules/.bin/c8 node test.mjs`.

To test the .d.ts files, run `./node_modules/.bin/tsd`.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
