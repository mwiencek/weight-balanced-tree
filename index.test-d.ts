import {
  expectError,
  expectType,
} from 'tsd';

import * as types from './types';
import * as wbt from './index';
import create from './create';
import find from './find';
import findNext from './findNext';
import findPrev from './findPrev';
import insert, {
  NOOP,
  REPLACE,
  THROW,
  insertIfNotExists,
  insertOrReplaceIfExists,
  insertOrThrowIfExists,
  onConflictKeepTreeValue,
  onConflictThrowError,
  onConflictUseGivenValue,
} from './insert';
import type {
  InsertConflictHandler,
} from './insert';
import iterate from './iterate';
import maxValue from './maxValue';
import minValue from './minValue';
import remove, {
  removeIfExists,
  removeOrThrowIfNotExists,
} from './remove';
import reverseIterate from './reverseIterate';

declare const stringTree: types.ImmutableTree<string> | null;
declare const nonNullStringTree: types.ImmutableTree<string>;

declare function cmpStrings(a: string, b: string): number;
declare function cmpNumbers(a: number, b: number): number;
declare function cmpNumberAndString(a: number, b: string): number;

// Basic usage
expectType<types.ImmutableTree<string>>(create<string>(''));
expectType<types.ImmutableTree<string>>(insert<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string>>(insert<string>(stringTree, '', cmpStrings, NOOP));
expectType<types.ImmutableTree<string>>(insert<string>(stringTree, '', cmpStrings, REPLACE));
expectType<types.ImmutableTree<string>>(insert<string>(stringTree, '', cmpStrings, THROW));
expectType<types.ImmutableTree<string>>(insert<string>(stringTree, '', cmpStrings, onConflictKeepTreeValue));
expectType<types.ImmutableTree<string>>(insert<string>(stringTree, '', cmpStrings, onConflictThrowError));
expectType<types.ImmutableTree<string>>(insert<string>(stringTree, '', cmpStrings, onConflictUseGivenValue));
expectType<types.ImmutableTree<string>>(insert<string>(stringTree, '', cmpStrings, (a: string, b: string) => a + b));
expectType<types.ImmutableTree<string>>(insertIfNotExists<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string>>(insertOrReplaceIfExists<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string>>(insertOrThrowIfExists<string>(stringTree, '', cmpStrings));
expectType<Generator<string, undefined, undefined>>(iterate<string>(stringTree));
expectType<Generator<string, undefined, undefined>>(reverseIterate<string>(stringTree));
expectType<types.ImmutableTree<string> | null>(find<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string> | null>(findNext<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string> | null>(findPrev<string>(stringTree, '', cmpStrings));
expectType<string>(maxValue<string>(nonNullStringTree));
expectType<string>(minValue<string>(nonNullStringTree));
expectType<types.ImmutableTree<string> | null>(remove<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string> | null>(removeIfExists<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string> | null>(removeOrThrowIfNotExists<string>(stringTree, '', cmpStrings));

// Value type override
expectType<types.ImmutableTree<string> | null>(find<string, number>(stringTree, 0, cmpNumberAndString));
expectType<types.ImmutableTree<string> | null>(findNext<string, number>(stringTree, 0, cmpNumberAndString));
expectType<types.ImmutableTree<string> | null>(findPrev<string, number>(stringTree, 0, cmpNumberAndString));

// Wrong tree type
expectError<types.ImmutableTree<number>>(create<number>(''));
expectError<types.ImmutableTree<number>>(insert<number>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<number>>(insertIfNotExists<number>(stringTree, '', cmpStrings));
expectError<types.ImmutableTree<number>>(insertOrReplaceIfExists<number>(stringTree, '', cmpStrings));
expectError<types.ImmutableTree<number>>(insertOrThrowIfExists<number>(stringTree, '', cmpStrings));
expectError<Generator<number, undefined, undefined>>(iterate<number>(stringTree));
expectError<Generator<number, undefined, undefined>>(reverseIterate<number>(stringTree));
expectError<types.ImmutableTree<number> | null>(find<number>(stringTree, 0, cmpNumbers));
expectError<number>(maxValue<number>(nonNullStringTree));
expectError<number>(minValue<number>(nonNullStringTree));
expectError<string>(maxValue<string>(stringTree));
expectError<string>(minValue<string>(stringTree));
expectError<types.ImmutableTree<number> | null>(remove<number>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<number> | null>(removeIfExists<number>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<number> | null>(removeOrThrowIfNotExists<number>(stringTree, '', cmpNumbers));

// Wrong comparator function type
expectError<types.ImmutableTree<string> | null>(find<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string> | null>(findNext<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string> | null>(findPrev<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string>>(insert<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string> | null>(remove<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string> | null>(removeIfExists<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string> | null>(removeOrThrowIfNotExists<string>(stringTree, '', cmpNumbers));

// Value type override + wrong comparator function type
expectError<types.ImmutableTree<string> | null>(find<string, number>(stringTree, 0, cmpStrings));
expectError<types.ImmutableTree<string> | null>(findNext<string, number>(stringTree, 0, cmpStrings));
expectError<types.ImmutableTree<string> | null>(findPrev<string, number>(stringTree, 0, cmpStrings));

expectType<typeof NOOP>(wbt.NOOP);
expectType<typeof REPLACE>(wbt.REPLACE);
expectType<typeof THROW>(wbt.THROW);
expectType<typeof create>(wbt.create);
expectType<typeof find>(wbt.find);
expectType<typeof findNext>(wbt.findNext);
expectType<typeof findPrev>(wbt.findPrev);
expectType<typeof insert>(wbt.insert);
expectType<typeof insertIfNotExists>(wbt.insertIfNotExists);
expectType<typeof insertOrReplaceIfExists>(wbt.insertOrReplaceIfExists);
expectType<typeof insertOrThrowIfExists>(wbt.insertOrThrowIfExists);
expectType<typeof iterate>(wbt.iterate);
expectType<typeof reverseIterate>(wbt.reverseIterate);
expectType<typeof maxValue>(wbt.maxValue);
expectType<typeof minValue>(wbt.minValue);
expectType<typeof remove>(wbt.remove);
expectType<typeof removeIfExists>(wbt.removeIfExists);
expectType<typeof removeOrThrowIfNotExists>(wbt.removeOrThrowIfNotExists);
expectType<InsertConflictHandler<number>>((a: number, b: number) => a + b);
