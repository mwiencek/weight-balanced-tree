import {
  expectAssignable,
  expectError,
  expectType,
} from 'tsd';

import * as types from '../src/types';
import * as wbt from '../src/index';
import create from '../src/create';
import difference from '../src/difference';
import {
  ValueExistsError,
  ValueNotFoundError,
  ValueOrderError,
} from '../src/errors';
import equals from '../src/equals';
import find from '../src/find';
import findNext from '../src/findNext';
import findPrev from '../src/findPrev';
import fromDistinctAscArray from '../src/fromDistinctAscArray';
import insert, {
  insertIfNotExists,
  insertOrReplaceIfExists,
  insertOrThrowIfExists,
} from '../src/insert';
import iterate from '../src/iterate';
import map from '../src/map';
import maxValue from '../src/maxValue';
import minValue from '../src/minValue';
import remove, {
  removeIfExists,
  removeOrThrowIfNotExists,
} from '../src/remove';
import reverseIterate from '../src/reverseIterate';
import toArray from '../src/toArray';
import union, {
  onConflictUseSecondValue,
} from '../src/union';
import update, {
  onConflictKeepTreeValue,
  onConflictThrowError,
  onConflictUseGivenValue,
  onNotFoundDoNothing,
  onNotFoundThrowError,
  onNotFoundUseGivenValue,
} from '../src/update';
import type {
  InsertConflictHandler,
  InsertNotFoundHandler,
} from '../src/update';
import zip from '../src/zip';

declare const stringTree: types.ImmutableTree<string> | null;
declare const nonNullStringTree: types.ImmutableTree<string>;
declare const numberTree: types.ImmutableTree<number> | null;

declare function areStringsEqual(a: string, b: string): boolean;
declare function areNumbersEqual(a: number, b: number): boolean;
declare function cmpStrings(a: string, b: string): number;
declare function cmpNumbers(a: number, b: number): number;
declare function cmpNullableNumbers(a: number | null, b: number | null): number;
declare function cmpNumberAndString(a: number, b: string): number;
declare function toString(num: number): string;

// Basic usage
expectType<types.ImmutableTree<string>>(create<string>(''));
expectType<types.ImmutableTree<number | null> | null>(update<number | null, number>(numberTree, 0, cmpNullableNumbers, onConflictKeepTreeValue, onNotFoundUseGivenValue));
expectType<types.ImmutableTree<string> | null>(update<string, number>(stringTree, 0, cmpNumberAndString, onConflictKeepTreeValue, onNotFoundDoNothing));
expectType<types.ImmutableTree<string> | null>(update<string, number>(stringTree, 0, cmpNumberAndString, onConflictKeepTreeValue, onNotFoundThrowError));
expectType<types.ImmutableTree<string>>(insert<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string>>(insert<string>(stringTree, '', cmpStrings, onConflictKeepTreeValue));
expectType<types.ImmutableTree<string>>(insert<string>(stringTree, '', cmpStrings, onConflictThrowError));
expectType<types.ImmutableTree<string>>(insert<string>(stringTree, '', cmpStrings, onConflictUseGivenValue));
expectType<types.ImmutableTree<string>>(insert<string>(stringTree, '', cmpStrings, (a: string, b: string) => a + b));
expectType<types.ImmutableTree<string>>(insertIfNotExists<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string>>(insertOrReplaceIfExists<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string>>(insertOrThrowIfExists<string>(stringTree, '', cmpStrings));
expectType<Generator<string, undefined, undefined>>(iterate<string>(stringTree));
expectType<Generator<string, undefined, undefined>>(reverseIterate<string>(stringTree));
expectType<boolean>(equals<string>(stringTree, stringTree));
expectType<boolean>(equals<string>(stringTree, stringTree, areStringsEqual));
expectType<string>(find<string>(stringTree, '', cmpStrings, ''));
expectType<string>(findNext<string>(stringTree, '', cmpStrings, ''));
expectType<string>(findPrev<string>(stringTree, '', cmpStrings, ''));
expectType<types.ImmutableTree<string> | null>(fromDistinctAscArray<string>(['']));
expectType<types.ImmutableTree<string> | null>(map<number, string>(numberTree, toString));
expectType<string>(maxValue<string>(nonNullStringTree));
expectType<string>(minValue<string>(nonNullStringTree));
expectType<types.ImmutableTree<string> | null>(remove<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string> | null>(removeIfExists<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string> | null>(removeOrThrowIfNotExists<string>(stringTree, '', cmpStrings));
expectType<Array<string>>(toArray(stringTree));
expectType<types.ImmutableTree<string> | null>(union(stringTree, stringTree, cmpStrings));
expectType<types.ImmutableTree<string> | null>(union(stringTree, stringTree, cmpStrings, onConflictUseSecondValue));
expectType<types.ImmutableTree<string> | null>(difference(stringTree, stringTree, cmpStrings));
expectType<Generator<[string | undefined, number | undefined], undefined, undefined>>(zip(stringTree, numberTree));

// Value type override
expectType<string | null>(find<string, number, null>(stringTree, 0, cmpNumberAndString, null));
expectType<string | null>(findNext<string, number, null>(stringTree, 0, cmpNumberAndString, null));
expectType<string | null>(findPrev<string, number, null>(stringTree, 0, cmpNumberAndString, null));

// Wrong tree type
expectError<types.ImmutableTree<number>>(create<number>(''));
expectError<types.ImmutableTree<number>>(insert<number>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<number>>(insertIfNotExists<number>(stringTree, '', cmpStrings));
expectError<types.ImmutableTree<number>>(insertOrReplaceIfExists<number>(stringTree, '', cmpStrings));
expectError<types.ImmutableTree<number>>(insertOrThrowIfExists<number>(stringTree, '', cmpStrings));
expectError<Generator<number, undefined, undefined>>(iterate<number>(stringTree));
expectError<Generator<number, undefined, undefined>>(reverseIterate<number>(stringTree));
expectError<boolean>(equals<number>(stringTree, stringTree, areStringsEqual));
expectError<number>(find<number>(stringTree, 0, cmpNumbers, 0));
expectError<types.ImmutableTree<number>>(fromDistinctAscArray<number>(['']));
expectError<types.ImmutableTree<string> | null>(map<number, string>(stringTree, toString));
expectError<number>(maxValue<number>(nonNullStringTree));
expectError<number>(minValue<number>(nonNullStringTree));
expectError<string>(maxValue<string>(stringTree));
expectError<string>(minValue<string>(stringTree));
expectError<types.ImmutableTree<number> | null>(remove<number>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<number> | null>(removeIfExists<number>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<number> | null>(removeOrThrowIfNotExists<number>(stringTree, '', cmpNumbers));
expectError<ReadonlyArray<string>>(toArray<string>(numberTree));
expectError<types.ImmutableTree<number> | null>(union<number>(stringTree, stringTree, cmpNumbers));
expectError<types.ImmutableTree<number> | null>(difference<number>(stringTree, stringTree, cmpNumbers));
expectError<Generator<[string | undefined, number | undefined], undefined, undefined>>(zip(numberTree, stringTree));

// Wrong comparator function type
expectError<types.ImmutableTree<string> | null>(equals<string>(stringTree, stringTree, areNumbersEqual));
expectError<string>(find<string>(stringTree, '', cmpNumbers, ''));
expectError<string>(findNext<string>(stringTree, '', cmpNumbers, ''));
expectError<string>(findPrev<string>(stringTree, '', cmpNumbers, ''));
expectError<types.ImmutableTree<string>>(insert<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string> | null>(remove<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string> | null>(removeIfExists<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string> | null>(removeOrThrowIfNotExists<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string> | null>(union<string>(stringTree, stringTree, cmpNumbers));
expectError<types.ImmutableTree<string> | null>(difference<string>(stringTree, stringTree, cmpNumbers));

// Wrong 'mapper' function type.
expectError<types.ImmutableTree<string> | null>(map<number, string>(numberTree, (x: string) => parseInt(x, 10)));

// Value type override + wrong comparator function type
expectError<string>(find<string, number>(stringTree, 0, cmpStrings, ''));
expectError<string>(findNext<string, number>(stringTree, 0, cmpStrings, ''));
expectError<string>(findPrev<string, number>(stringTree, 0, cmpStrings, ''));

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
expectError<types.ImmutableTree<string>>(update<string, number>(stringTree, 0, cmpNumberAndString, onConflictKeepTreeValue, onNotFoundUseGivenValue));

// Error classes
expectAssignable<Error>(new ValueExistsError('a'));
expectAssignable<Error>(new ValueNotFoundError('a'));
expectAssignable<Error>(new ValueOrderError('a', 'b'));

expectType<typeof create>(wbt.create);
expectType<typeof difference>(wbt.difference);
expectType<typeof equals>(wbt.equals);
expectType<typeof find>(wbt.find);
expectType<typeof findNext>(wbt.findNext);
expectType<typeof findPrev>(wbt.findPrev);
expectType<typeof fromDistinctAscArray>(wbt.fromDistinctAscArray);
expectType<typeof insert>(wbt.insert);
expectType<typeof insertIfNotExists>(wbt.insertIfNotExists);
expectType<typeof insertOrReplaceIfExists>(wbt.insertOrReplaceIfExists);
expectType<typeof insertOrThrowIfExists>(wbt.insertOrThrowIfExists);
expectType<typeof iterate>(wbt.iterate);
expectType<typeof reverseIterate>(wbt.reverseIterate);
expectType<typeof map>(wbt.map);
expectType<typeof maxValue>(wbt.maxValue);
expectType<typeof minValue>(wbt.minValue);
expectType<typeof remove>(wbt.remove);
expectType<typeof removeIfExists>(wbt.removeIfExists);
expectType<typeof removeOrThrowIfNotExists>(wbt.removeOrThrowIfNotExists);
expectType<typeof toArray>(wbt.toArray);
expectType<typeof union>(wbt.union);
expectType<typeof update>(wbt.update);
expectType<typeof zip>(wbt.zip);
