import {
  expectAssignable,
  expectError,
  expectType,
} from 'tsd';

import * as types from './types';
import * as wbt from './index';
import create from './create';
import {
  ValueExistsError,
  ValueNotFoundError,
  ValueOrderError,
} from './errors';
import equals from './equals';
import find from './find';
import findNext from './findNext';
import findPrev from './findPrev';
import fromDistinctAscArray from './fromDistinctAscArray';
import insert, {
  NOOP,
  REPLACE,
  THROW,
  insertByKey,
  insertIfNotExists,
  insertOrReplaceIfExists,
  insertOrThrowIfExists,
  onConflictKeepTreeValue,
  onConflictThrowError,
  onConflictUseGivenValue,
  onNotFoundDoNothing,
  onNotFoundThrowError,
  onNotFoundUseGivenValue,
} from './insert';
import type {
  InsertConflictHandler,
  InsertNotFoundHandler,
} from './insert';
import iterate from './iterate';
import maxValue from './maxValue';
import minValue from './minValue';
import remove, {
  removeIfExists,
  removeOrThrowIfNotExists,
} from './remove';
import reverseIterate from './reverseIterate';
import toArray from './toArray';
import union, {
  onConflictUseSecondValue,
} from './union';
import zip from './zip';

declare const stringTree: types.ImmutableTree<string> | null;
declare const nonNullStringTree: types.ImmutableTree<string>;
declare const numberTree: types.ImmutableTree<number> | null;

declare function cmpStrings(a: string, b: string): number;
declare function cmpNumbers(a: number, b: number): number;
declare function cmpNullableNumbers(a: number | null, b: number | null): number;
declare function cmpNumberAndString(a: number, b: string): number;

// Basic usage
expectType<types.ImmutableTree<string>>(create<string>(''));
expectType<types.ImmutableTree<number | null> | null>(insertByKey<number | null, number>(numberTree, 0, cmpNullableNumbers, onConflictKeepTreeValue, onNotFoundUseGivenValue));
expectType<types.ImmutableTree<string> | null>(insertByKey<string, number>(stringTree, 0, cmpNumberAndString, onConflictKeepTreeValue, onNotFoundDoNothing));
expectType<types.ImmutableTree<string> | null>(insertByKey<string, number>(stringTree, 0, cmpNumberAndString, onConflictKeepTreeValue, onNotFoundThrowError));
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
expectType<boolean>(equals<string>(stringTree, stringTree, cmpStrings));
expectType<types.ImmutableTree<string> | null>(find<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string> | null>(findNext<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string> | null>(findPrev<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string> | null>(fromDistinctAscArray<string>(['']));
expectType<string>(maxValue<string>(nonNullStringTree));
expectType<string>(minValue<string>(nonNullStringTree));
expectType<types.ImmutableTree<string> | null>(remove<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string> | null>(removeIfExists<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string> | null>(removeOrThrowIfNotExists<string>(stringTree, '', cmpStrings));
expectType<ReadonlyArray<string>>(toArray(stringTree));
expectType<types.ImmutableTree<string> | null>(union(stringTree, stringTree, cmpStrings));
expectType<types.ImmutableTree<string> | null>(union(stringTree, stringTree, cmpStrings, onConflictUseSecondValue));
expectType<Generator<[string | undefined, number | undefined], undefined, undefined>>(zip(stringTree, numberTree));

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
expectError<boolean>(equals<number>(stringTree, stringTree, cmpStrings));
expectError<types.ImmutableTree<number> | null>(find<number>(stringTree, 0, cmpNumbers));
expectError<types.ImmutableTree<number>>(fromDistinctAscArray<number>(['']));
expectError<number>(maxValue<number>(nonNullStringTree));
expectError<number>(minValue<number>(nonNullStringTree));
expectError<string>(maxValue<string>(stringTree));
expectError<string>(minValue<string>(stringTree));
expectError<types.ImmutableTree<number> | null>(remove<number>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<number> | null>(removeIfExists<number>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<number> | null>(removeOrThrowIfNotExists<number>(stringTree, '', cmpNumbers));
expectError<ReadonlyArray<string>>(toArray<string>(numberTree));
expectError<types.ImmutableTree<number> | null>(union<number>(stringTree, stringTree, cmpNumbers));
expectError<Generator<[string | undefined, number | undefined], undefined, undefined>>(zip(numberTree, stringTree));

// Wrong comparator function type
expectError<types.ImmutableTree<string> | null>(equals<string>(stringTree, stringTree, cmpNumbers));
expectError<types.ImmutableTree<string> | null>(find<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string> | null>(findNext<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string> | null>(findPrev<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string>>(insert<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string> | null>(remove<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string> | null>(removeIfExists<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string> | null>(removeOrThrowIfNotExists<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string> | null>(union<string>(stringTree, stringTree, cmpNumbers));

// Value type override + wrong comparator function type
expectError<types.ImmutableTree<string> | null>(find<string, number>(stringTree, 0, cmpStrings));
expectError<types.ImmutableTree<string> | null>(findNext<string, number>(stringTree, 0, cmpStrings));
expectError<types.ImmutableTree<string> | null>(findPrev<string, number>(stringTree, 0, cmpStrings));

// InsertConflictHandler
expectType<InsertConflictHandler<string, number>>((a: string, b: number) => a + String(b));
expectAssignable<InsertConflictHandler<unknown, unknown>>(onConflictKeepTreeValue);
expectAssignable<InsertConflictHandler<unknown, unknown>>(onConflictThrowError);
expectAssignable<InsertConflictHandler<unknown, unknown>>(onConflictUseGivenValue);

// InsertNotFoundHandler
expectType<InsertNotFoundHandler<string, number>>((a: number) => String(a));
expectAssignable<InsertNotFoundHandler<unknown, unknown>>(onNotFoundDoNothing);
expectAssignable<InsertNotFoundHandler<unknown, unknown>>(onNotFoundThrowError);
expectAssignable<InsertNotFoundHandler<unknown, unknown>>(onNotFoundUseGivenValue);

// Wrong 'onNotFound' function type.
expectError<types.ImmutableTree<string>>(insertByKey<string, number>(stringTree, 0, cmpNumberAndString, onConflictKeepTreeValue, onNotFoundUseGivenValue));

// Error classes
expectAssignable<Error>(new ValueExistsError('a'));
expectAssignable<Error>(new ValueNotFoundError('a'));
expectAssignable<Error>(new ValueOrderError('a', 'b'));

expectType<typeof NOOP>(wbt.NOOP);
expectType<typeof REPLACE>(wbt.REPLACE);
expectType<typeof THROW>(wbt.THROW);
expectType<typeof create>(wbt.create);
expectType<typeof equals>(wbt.equals);
expectType<typeof find>(wbt.find);
expectType<typeof findNext>(wbt.findNext);
expectType<typeof findPrev>(wbt.findPrev);
expectType<typeof fromDistinctAscArray>(wbt.fromDistinctAscArray);
expectType<typeof insert>(wbt.insert);
expectType<typeof insertByKey>(wbt.insertByKey);
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
expectType<typeof toArray>(wbt.toArray);
expectType<typeof union>(wbt.union);
expectType<typeof zip>(wbt.zip);
