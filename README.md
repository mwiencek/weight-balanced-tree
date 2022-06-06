# weight-balanced-tree

A persistent weight-balanced (bounded balance) tree.

Both Flow and TypeScript definitions are included.

References:

 1. Adams, Stephen.
    "Implementing Sets Efficiently in a Functional Language."
    University of Southampton, n.d.
    Accessed at http://groups.csail.mit.edu/mac/users/adams/BB/92-10.ps

 2. [GHC's Data.Map.Internal](https://gitlab.haskell.org/ghc/packages/containers/-/blob/f00aa02/containers/src/Data/Map/Internal.hs).

## Installation

`npm install weight-balanced-tree` or `yarn add weight-balanced-tree`.

## API

```
type ImmutableTree<+T> = {
  +left: ImmutableTree<T> | null,
  +right: ImmutableTree<T> | null,
  +size: number,
  +value: T,
};

type InsertConflictHandler<T, K> =
  (existingTreeValue: T, key: K) => T;

type InsertNotFoundHandler<T, K> =
  (key: T) => T;
```

### insert

```
insert<T>(
    tree: ImmutableTree<T> | null,
    value: T,
    cmp: (T, T) => number,
    onConflict?: InsertConflictHandler<T, T>,
): ImmutableTree<T>;
```

Returns a new version of `tree` with `value` inserted.  The old version is not
modified.

Pass `null` for `tree` to create a new tree.  (This module has no such thing
as a tree of size 0.)

The `cmp` (comparator) function is used to order the values.  It works the
same as the comparator you'd pass to `Array.prototype.sort`, and should
never change for a particular tree.

`onConflict` allows you to configure what happens when `value` already exists
in the tree according to `cmp`.  It receives the existing tree value as its
first argument, and the value you passed to `insert` as its second argument.

`onConflict` is expected to return a final value to be inserted, or throw an
error if the value shouldn't exist.  This allows you to merge both values in
some way if needed.  However, the returned value must have the same sort
order as before.

If you return `existingTreeValue` from `onConflict`, `insert` will return the
same `tree` reference back.  `Object.is` is used to determine if the value
you return is the same as `existingTreeValue`.

If `onConflict` is not specified, the default action is to throw an error.
There are several exports in [insert.mjs](insert.mjs) that can be used here:

 * `onConflictThrowError` (the default), which throws an exception.
 * `onConflictKeepTreeValue`, which just returns the existing tree value back
   unmodified.  In this case, `insert` will also return the same tree
   reference back.
 * `onConflictUseGivenValue`, which replaces the existing tree value with the
   value given to `insert`.

There are also some convenience functions available that call `insert` with
these options for you:

 * `insertIfNotExists` (passes `onConflictKeepTreeValue` for you)
 * `insertOrReplaceIfExists` (passes `onConflictUseGivenValue` for you)

`insertOrThrowIfExists` is an alias of `insert`.

### insertByKey

```
insertByKey<T, K>(
    tree: ImmutableTree<T> | null,
    key: K,
    cmp: (key: K, treeValue: T) => number,
    onConflict: InsertConflictHandler<T, K>,
    onNotFound: InsertNotFoundHandler<T, K>,
): ImmutableTree<T>;
```

This is a generalized version of `insert` (which calls `insertByKey` under
the hood).  The main difference is that it takes a `key` of type `K` instead
of a `value` of type `T`, and allows you to construct a value when `key` is
not found.

This is particularly convenient where you're using the tree as a map. and the
keys are properties of the items being mapped.

`onNotFound` handles the key-not-found case.  It only receives one argument,
the `key` you passed to `insertByKey`.  Like `onConflict`, you are expected to
return a final value of type `T` to be inserted.

`onNotFound` is useful in at least a couple scenarios:

  * You want to create the value to insert lazily, only if it doesn't exist.

  * You want to throw an error if the value doesn't exist (because you expect
    to replace it).

Here's an example of sorting/mapping objects by a simple key property and
lazily creating them:

```TypeScript
interface Item {
  readonly key: number;
}

function compareKeyWithItemKey(key: number, item: Item): number {
  return key - item.key;
}

function onNotFoundCreateItemFromKey(key: number): Item {
  return {key};
}

insertByKey<Item, number>(
  tree,
  /* key = */ 1,
  compareKeyWithItemKey,
  onConflictThrowError,
  onNotFoundCreateItemFromKey,
);

// a "find or insert" implementation:

let item2;
insertByKey<Item, number>(
  tree,
  /* key = */ 1,
  compareKeyWithItemKey,
  (existingItem: Item) => {
    item2 = existingItem;
  },
  (key: number) => {
    item2 = onNotFoundCreateItemFromKey(key);
    return item2;
  },
);
```

### remove

```
remove<T>(
    tree: ImmutableTree<T> | null,
    value: T,
    cmp: (T, T) => number,
): ImmutableTree<T> | null;
```

Returns a new version of `tree` with `value` removed.  The old version is not
modified.

If `value` is not found in the tree, the same tree reference is returned
back.

If this was the last value in `tree`, `null` is returned (indicating an empty
tree).

The `cmp` (comparator) function is the same as used for `insert`.

`removeIfExists` is an alias of `remove`.

### removeOrThrowIfNotExists

Like `remove`, but throws an error if `value` does not exist in the tree.

This simply checks if the tree returned from `remove` is the same reference.

### equals

```
equals<T>(
  a: ImmutableTree<T> | null,
  b: ImmutableTree<T> | null,
  cmp: (a: T, b: T) => number,
): boolean;
```

Returns `true` if two trees contain the same values, or `false` otherwise.

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
