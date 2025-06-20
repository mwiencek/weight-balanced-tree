import {
  expectAssignable,
  expectError,
  expectType,
} from 'tsd';

import * as types from '../src/types';
import * as wbt from '../src/index';
import at from '../src/at';
import {setDelta} from '../src/balance';
import create from '../src/create';
import difference from '../src/difference';
import empty from '../src/empty';
import {
  ValueExistsError,
  ValueNotFoundError,
  ValueOrderError,
} from '../src/errors';
import equals from '../src/equals';
import filter from '../src/filter';
import find from '../src/find';
import findBy from '../src/findBy';
import findNext from '../src/findNext';
import findPrev from '../src/findPrev';
import fromDistinctAscArray from '../src/fromDistinctAscArray';
import indexOf from '../src/indexOf';
import insert, {
  insertIfNotExists,
  insertOrReplaceIfExists,
  insertOrThrowIfExists,
} from '../src/insert';
import intersection from '../src/intersection';
import iterate from '../src/iterate';
import map from '../src/map';
import maxValue from '../src/maxValue';
import minValue from '../src/minValue';
import remove, {
  removeIfExists,
  removeOrThrowIfNotExists,
} from '../src/remove';
import reverseIterate from '../src/reverseIterate';
import split from '../src/split';
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
import validate, {
  type ValidateResult,
} from '../src/validate';
import withKeyComparator from '../src/withKeyComparator';
import type {
  InsertConflictHandler,
  InsertNotFoundHandler,
} from '../src/update';
import zip from '../src/zip';

declare type NSTuple = [number, string];
declare const stringTree: types.ImmutableTree<string>;
declare const numberTree: types.ImmutableTree<number>;
declare const numberStringMapTree: types.ImmutableTree<NSTuple>;

declare function areStringsEqual(a: string, b: string): boolean;
declare function areNumbersEqual(a: number, b: number): boolean;
declare function areNumberAndStringEqual(a: number, b: string): boolean;
declare function cmpStrings(a: string, b: string): number;
declare function cmpNumbers(a: number, b: number): number;
declare function cmpNullableNumbers(a: number | null, b: number | null): number;
declare function cmpNumberAndString(a: number, b: string): number;
declare function getNumberKeyFromTuple(tuple: NSTuple): number;
declare function toString(num: number): string;

// Basic usage
expectType<types.EmptyImmutableTree>(empty);
expectType<types.ImmutableTree<string>>(create<string>(''));
expectType<types.ImmutableTree<number | null>>(update<number | null, number>(numberTree, 0, cmpNullableNumbers, onConflictKeepTreeValue, onNotFoundUseGivenValue));
expectType<types.ImmutableTree<string>>(update<string, number>(stringTree, 0, cmpNumberAndString, onConflictKeepTreeValue, onNotFoundDoNothing));
expectType<types.ImmutableTree<string>>(update<string, number>(stringTree, 0, cmpNumberAndString, onConflictKeepTreeValue, onNotFoundThrowError));
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
expectType<boolean>(equals<number, string>(numberTree, stringTree, areNumberAndStringEqual));
expectType<types.ImmutableTree<string>>(filter(stringTree, (x: string) => x.startsWith('foo')));
expectType<string>(find<string>(stringTree, '', cmpStrings, ''));
expectType<string>(findBy<string>(stringTree, (treeValue: string) => cmpStrings(treeValue, ''), ''));
expectType<string>(findNext<string>(stringTree, '', cmpStrings, ''));
expectType<string>(findPrev<string>(stringTree, '', cmpStrings, ''));
expectType<types.ImmutableTree<string>>(fromDistinctAscArray<string>(['']));
expectType<number>(indexOf<number>(numberTree, 1, cmpNumbers));
expectType<types.ImmutableTree<string>>(map<number, string>(numberTree, toString));
expectType<types.ImmutableTree<string>>(remove<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string>>(removeIfExists<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string>>(removeOrThrowIfNotExists<string>(stringTree, '', cmpStrings));
expectType<[types.ImmutableTree<number>, types.ImmutableTree<number>, types.ImmutableTree<number>]>(split(numberTree, 0, cmpNumbers));
expectType<Array<string>>(toArray(stringTree));
expectType<types.ImmutableTree<string>>(union(stringTree, stringTree, cmpStrings));
expectType<types.ImmutableTree<string>>(union(stringTree, stringTree, cmpStrings, onConflictUseSecondValue));
expectType<types.ImmutableTree<string>>(difference(stringTree, stringTree, cmpStrings));
expectType<types.ImmutableTree<string>>(intersection(stringTree, stringTree, cmpStrings));
expectType<Generator<[string | undefined, number | undefined], undefined, undefined>>(zip(stringTree, numberTree));
expectType<ValidateResult<string>>(validate(stringTree, cmpStrings));
expectType<undefined>(setDelta(3));

// Value type override
expectType<string | null>(find<string, number, null>(stringTree, 0, cmpNumberAndString, null));
expectType<string | null>(findBy<string, null>(stringTree, (treeValue: string) => cmpStrings(treeValue, ''), null));
expectType<string | null>(findNext<string, number, null>(stringTree, 0, cmpNumberAndString, null));
expectType<string | null>(findPrev<string, number, null>(stringTree, 0, cmpNumberAndString, null));
expectType<number>(indexOf<string, number>(stringTree, 1, cmpNumberAndString));
expectType<[types.ImmutableTree<string>, types.ImmutableTree<string>, types.ImmutableTree<string>]>(split<string, number>(stringTree, 1, cmpNumberAndString));

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
expectError<number>(findBy<number>(stringTree, (treeValue: number) => cmpStrings(treeValue, 0), 0));
expectError<types.ImmutableTree<number>>(fromDistinctAscArray<number>(['']));
expectError<types.ImmutableTree<string>>(map<number, string>(stringTree, toString));
expectError<number>(maxValue<number>(stringTree));
expectError<number>(minValue<number>(stringTree));
expectError<types.ImmutableTree<number>>(remove<number>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<number>>(removeIfExists<number>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<number>>(removeOrThrowIfNotExists<number>(stringTree, '', cmpNumbers));
expectError<[types.ImmutableTree<number>, types.ImmutableTree<number>, types.ImmutableTree<number>]>(split<number>(stringTree, 1, cmpNumbers));
expectError<ReadonlyArray<string>>(toArray<string>(numberTree));
expectError<types.ImmutableTree<number>>(union<number>(stringTree, stringTree, cmpNumbers));
expectError<types.ImmutableTree<number>>(difference<number>(stringTree, stringTree, cmpNumbers));
expectError<types.ImmutableTree<number>>(intersection<number>(stringTree, stringTree, cmpNumbers));
expectError<Generator<[string | undefined, number | undefined], undefined, undefined>>(zip(numberTree, stringTree));

// Wrong comparator function type
expectError<types.ImmutableTree<string>>(equals<string>(stringTree, stringTree, areNumbersEqual));
expectError<string>(find<string>(stringTree, '', cmpNumbers, ''));
expectError<string>(findNext<string>(stringTree, '', cmpNumbers, ''));
expectError<string>(findPrev<string>(stringTree, '', cmpNumbers, ''));
expectError<types.ImmutableTree<string>>(insert<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string>>(remove<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string>>(removeIfExists<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string>>(removeOrThrowIfNotExists<string>(stringTree, '', cmpNumbers));
expectError<[types.ImmutableTree<string>, types.ImmutableTree<string>, types.ImmutableTree<string>]>(split<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string>>(union<string>(stringTree, stringTree, cmpNumbers));
expectError<types.ImmutableTree<string>>(difference<string>(stringTree, stringTree, cmpNumbers));
expectError<types.ImmutableTree<string>>(intersection<number>(stringTree, stringTree, cmpNumbers));

// Wrong 'mapper' function type.
expectError<types.ImmutableTree<string>>(map<number, string>(numberTree, (x: string) => parseInt(x, 10)));

// Value type override + wrong comparator function type
expectError<string>(find<string, number>(stringTree, 0, cmpStrings, ''));
expectError<string>(findNext<string, number>(stringTree, 0, cmpStrings, ''));
expectError<string>(findPrev<string, number>(stringTree, 0, cmpStrings, ''));

// InsertConflictHandler
expectAssignable<InsertConflictHandler<string, number>>((a: string, b: number) => a + String(b));
expectAssignable<InsertConflictHandler<unknown, unknown>>(onConflictKeepTreeValue);
expectAssignable<InsertConflictHandler<unknown, unknown>>(onConflictThrowError);
expectAssignable<InsertConflictHandler<unknown, unknown>>(onConflictUseGivenValue);

// InsertNotFoundHandler
expectAssignable<InsertNotFoundHandler<string, number>>((a: number) => String(a));
expectAssignable<InsertNotFoundHandler<unknown, unknown>>(onNotFoundDoNothing);
expectAssignable<InsertNotFoundHandler<unknown, unknown>>(onNotFoundThrowError);
expectAssignable<InsertNotFoundHandler<unknown, unknown>>(onNotFoundUseGivenValue);

// Wrong 'onNotFound' function type.
expectError<types.ImmutableTree<string>>(update<string, number>(stringTree, 0, cmpNumberAndString, onConflictKeepTreeValue, onNotFoundUseGivenValue));

// Error classes
expectAssignable<Error>(new ValueExistsError('a'));
expectAssignable<Error>(new ValueNotFoundError('a'));
expectAssignable<Error>(new ValueOrderError('a', 'b', 'less than'));

// withKeyComparator
const mapTreeWrapper = withKeyComparator<NSTuple, number>(cmpNumbers, getNumberKeyFromTuple);
expectType<types.ImmutableTree<NSTuple>>(mapTreeWrapper.difference(numberStringMapTree, empty));
expectType<NSTuple>(mapTreeWrapper.find(numberStringMapTree, 0, [0, ''] as NSTuple));
expectType<NSTuple | string>(mapTreeWrapper.find<string>(numberStringMapTree, 0, ''));
expectType<NSTuple>(mapTreeWrapper.findNext(numberStringMapTree, 0, [0, ''] as NSTuple));
expectType<NSTuple | string>(mapTreeWrapper.findNext<string>(numberStringMapTree, 0, ''));
expectType<NSTuple>(mapTreeWrapper.findPrev(numberStringMapTree, 1, [0, ''] as NSTuple));
expectType<NSTuple | string>(mapTreeWrapper.findPrev<string>(numberStringMapTree, 1, ''));
expectType<number>(mapTreeWrapper.indexOf(numberStringMapTree, 0));
expectType<types.ImmutableTree<NSTuple>>(mapTreeWrapper.insert(numberStringMapTree, [0, ''] as NSTuple));
expectType<types.ImmutableTree<NSTuple>>(mapTreeWrapper.insert(numberStringMapTree, [0, ''] as NSTuple, onConflictThrowError));
expectType<types.ImmutableTree<NSTuple>>(mapTreeWrapper.insertIfNotExists(numberStringMapTree, [0, ''] as NSTuple));
expectType<types.ImmutableTree<NSTuple>>(mapTreeWrapper.insertOrReplaceIfExists(numberStringMapTree, [0, ''] as NSTuple));
expectType<types.ImmutableTree<NSTuple>>(mapTreeWrapper.insertOrThrowIfExists(numberStringMapTree, [0, ''] as NSTuple));
expectType<types.ImmutableTree<NSTuple>>(mapTreeWrapper.intersection(numberStringMapTree, empty));
expectType<types.ImmutableTree<NSTuple>>(mapTreeWrapper.remove(numberStringMapTree, [0, ''] as NSTuple));
expectType<types.ImmutableTree<NSTuple>>(mapTreeWrapper.removeIfExists(numberStringMapTree, [0, ''] as NSTuple));
expectType<types.ImmutableTree<NSTuple>>(mapTreeWrapper.removeOrThrowIfNotExists(numberStringMapTree, [0, ''] as NSTuple));
expectType<[types.ImmutableTree<NSTuple>, types.ImmutableTree<NSTuple>, types.ImmutableTree<NSTuple>]>(mapTreeWrapper.split(numberStringMapTree, 0));
expectType<types.ImmutableTree<NSTuple>>(mapTreeWrapper.union(numberStringMapTree, numberStringMapTree));
expectType<types.ImmutableTree<NSTuple>>(mapTreeWrapper.union(numberStringMapTree, numberStringMapTree, onConflictThrowError));
expectType<types.ImmutableTree<NSTuple>>(mapTreeWrapper.update(numberStringMapTree, 1, onConflictThrowError, onNotFoundUseGivenValue));
expectType<ValidateResult<NSTuple>>(mapTreeWrapper.validate(numberStringMapTree));

expectType<typeof at>(wbt.at);
expectType<typeof create>(wbt.create);
expectType<typeof difference>(wbt.difference);
expectType<typeof empty>(wbt.empty);
expectType<typeof equals>(wbt.equals);
expectType<typeof filter>(wbt.filter);
expectType<typeof find>(wbt.find);
expectType<typeof findBy>(wbt.findBy);
expectType<typeof findNext>(wbt.findNext);
expectType<typeof findPrev>(wbt.findPrev);
expectType<typeof fromDistinctAscArray>(wbt.fromDistinctAscArray);
expectType<typeof indexOf>(wbt.indexOf);
expectType<typeof insert>(wbt.insert);
expectType<typeof insertIfNotExists>(wbt.insertIfNotExists);
expectType<typeof insertOrReplaceIfExists>(wbt.insertOrReplaceIfExists);
expectType<typeof insertOrThrowIfExists>(wbt.insertOrThrowIfExists);
expectType<typeof intersection>(wbt.intersection);
expectType<typeof iterate>(wbt.iterate);
expectType<typeof map>(wbt.map);
expectType<typeof maxValue>(wbt.maxValue);
expectType<typeof minValue>(wbt.minValue);
expectType<typeof remove>(wbt.remove);
expectType<typeof removeIfExists>(wbt.removeIfExists);
expectType<typeof removeOrThrowIfNotExists>(wbt.removeOrThrowIfNotExists);
expectType<typeof reverseIterate>(wbt.reverseIterate);
expectType<typeof setDelta>(wbt.setDelta);
expectType<typeof split>(wbt.split);
expectType<typeof toArray>(wbt.toArray);
expectType<typeof union>(wbt.union);
expectType<typeof update>(wbt.update);
expectType<typeof validate>(wbt.validate);
expectType<typeof withKeyComparator>(wbt.withKeyComparator);
expectType<typeof zip>(wbt.zip);
