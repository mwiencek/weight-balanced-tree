import {
  expectAssignable,
  expectError,
  expectType,
} from 'tsd';

import * as types from './types';
import * as wbt from './index';
import at from './at';
import {setDelta} from './balance';
import create from './create';
import difference from './difference';
import empty from './empty';
import {
  ValueExistsError,
  ValueNotFoundError,
  ValueOrderError,
} from './errors';
import equals from './equals';
import exists from './exists';
import filter from './filter';
import find from './find';
import findAll from './findAll';
import findBy from './findBy';
import findNext from './findNext';
import findNode from './findNode';
import findPrev from './findPrev';
import findWithIndex from './findWithIndex';
import fromDistinctAscArray from './fromDistinctAscArray';
import indexOf from './indexOf';
import insert, {
  insertIfNotExists,
  insertOrReplaceIfExists,
  insertOrThrowIfExists,
} from './insert';
import intersection from './intersection';
import iterate from './iterate';
import join from './join';
import join2 from './join2';
import map from './map';
import maxValue from './maxValue';
import minValue from './minValue';
import remove, {
  removeIfExists,
  removeOrThrowIfNotExists,
} from './remove';
import reverseIterate from './reverseIterate';
import setIndex from './setIndex';
import slice from './slice';
import splice, {type SpliceResult} from './splice';
import split, {type SplitResult} from './split';
import splitFirst from './splitFirst';
import splitIndex from './splitIndex';
import splitLast from './splitLast';
import symmetricDifference from './symmetricDifference';
import toArray from './toArray';
import union from './union';
import update, {
  onConflictKeepTreeValue,
  onConflictThrowError,
  onConflictUseGivenValue,
  onNotFoundDoNothing,
  onNotFoundThrowError,
  onNotFoundUseGivenValue,
} from './update';
import validate, {
  type ValidateResult,
} from './validate';
import type {
  InsertConflictHandler,
  InsertNotFoundHandler,
} from './update';
import zip from './zip';

declare type NSTuple = [number, string];
declare const stringTree: types.ImmutableTree<string>;
declare const numberTree: types.ImmutableTree<number>;
declare const numberStringMapTree: types.ImmutableTree<NSTuple>;
declare const nonEmptyNumberTree: types.NonEmptyImmutableTree<number>;

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
expectType<string | undefined>(at(stringTree, 0));
expectType<string>(at(stringTree, 0, ''));
expectType<string | number>(at<string, number>(stringTree, 0, 0));
expectType<types.ImmutableTree<string>>(create<string>(''));
expectType<types.ImmutableTree<number | null>>(update<number | null, number>(numberTree, {key: 0, cmp: cmpNullableNumbers, onConflict: onConflictKeepTreeValue, onNotFound: onNotFoundUseGivenValue}));
expectType<types.ImmutableTree<string>>(update<string, number>(stringTree, {key: 0, cmp: cmpNumberAndString, onConflict: onConflictKeepTreeValue, onNotFound: onNotFoundDoNothing}));
expectType<types.ImmutableTree<string>>(update<string, number>(stringTree, {key: 0, cmp: cmpNumberAndString, onConflict: onConflictKeepTreeValue, onNotFound: onNotFoundThrowError}));
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
expectType<boolean>(exists<string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string>>(filter(stringTree, (x: string) => x.startsWith('foo')));
expectType<string>(find<string>(stringTree, '', cmpStrings, ''));
expectType<Generator<string, undefined, undefined>>(findAll<string>(stringTree, '', cmpStrings));
expectType<string>(findBy<string>(stringTree, (treeValue: string) => cmpStrings(treeValue, ''), ''));
expectType<string>(findNext<string>(stringTree, '', cmpStrings, ''));
expectType<types.NonEmptyImmutableTree<string> | null>(findNode<string>(stringTree, '', cmpStrings));
expectType<string>(findPrev<string>(stringTree, '', cmpStrings, ''));
expectType<[string, number]>(findWithIndex<string>(stringTree, '', cmpStrings, ''));
expectType<types.ImmutableTree<string>>(fromDistinctAscArray<string>(['']));
expectType<number>(indexOf<number>(numberTree, 1, cmpNumbers));
expectType<types.NonEmptyImmutableTree<number>>(join(numberTree, 0, numberTree));
expectType<types.ImmutableTree<number>>(join2(numberTree, numberTree));
expectType<types.ImmutableTree<string>>(map<number, string>(numberTree, toString));
expectType<types.ImmutableTree<string>>(remove<string, string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string>>(removeIfExists<string, string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string>>(removeOrThrowIfNotExists<string, string>(stringTree, '', cmpStrings));
expectType<types.ImmutableTree<string>>(setIndex(stringTree, 0, 'foo'));
expectType<types.ImmutableTree<string>>(slice(stringTree, 1, 2));
expectType<types.ImmutableTree<string>>(slice(stringTree, 1));
expectType<types.ImmutableTree<string>>(slice(stringTree));
expectType<SpliceResult<number>>(splice(numberTree, 1, 2, numberTree));
expectType<SplitResult<number>>(split(numberTree, 0, cmpNumbers));
expectType<SplitResult<number>>(splitIndex(numberTree, 0));
expectType<{readonly tree: types.ImmutableTree<number>; readonly value: number}>(splitFirst<number>(nonEmptyNumberTree));
expectType<{readonly tree: types.ImmutableTree<number>; readonly value: number}>(splitLast<number>(nonEmptyNumberTree));
expectType<Array<string>>(toArray(stringTree));
expectType<types.ImmutableTree<string>>(union(stringTree, stringTree, cmpStrings));
expectType<types.ImmutableTree<string>>(union(stringTree, stringTree, cmpStrings, (v1, v2) => v2));
expectType<types.ImmutableTree<string>>(difference(stringTree, stringTree, cmpStrings));
expectType<types.ImmutableTree<string>>(intersection(stringTree, stringTree, cmpStrings));
expectType<types.ImmutableTree<number>>(symmetricDifference<number>(numberTree, numberTree, cmpNumbers));
expectType<Generator<[string | undefined, number | undefined], undefined, undefined>>(zip(stringTree, numberTree));
expectType<ValidateResult<string>>(validate(stringTree, cmpStrings));
expectType<undefined>(setDelta(3));

// Value type override
expectType<boolean>(exists<string, number>(stringTree, 0, cmpNumberAndString));
expectType<string | null>(find<string, number, null>(stringTree, 0, cmpNumberAndString, null));
expectType<Generator<string, undefined, undefined>>(findAll<string, number>(stringTree, 0, cmpNumberAndString));
expectType<string | null>(findBy<string, null>(stringTree, (treeValue: string) => cmpStrings(treeValue, ''), null));
expectType<string | null>(findNext<string, number, null>(stringTree, 0, cmpNumberAndString, null));
expectType<string | null>(findPrev<string, number, null>(stringTree, 0, cmpNumberAndString, null));
expectType<[string | null, number]>(findWithIndex<string, number, null>(stringTree, 0, cmpNumberAndString, null));
expectType<number>(indexOf<string, number>(stringTree, 1, cmpNumberAndString));
expectType<SplitResult<string>>(split<string, number>(stringTree, 1, cmpNumberAndString));

// Wrong tree type
expectError<types.ImmutableTree<number>>(create<number>(''));
expectError<types.ImmutableTree<number>>(insert<number>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<number>>(insertIfNotExists<number>(stringTree, '', cmpStrings));
expectError<types.ImmutableTree<number>>(insertOrReplaceIfExists<number>(stringTree, '', cmpStrings));
expectError<types.ImmutableTree<number>>(insertOrThrowIfExists<number>(stringTree, '', cmpStrings));
expectError<Generator<number, undefined, undefined>>(iterate<number>(stringTree));
expectError<Generator<number, undefined, undefined>>(reverseIterate<number>(stringTree));
expectError<boolean>(equals<number>(stringTree, stringTree, areStringsEqual));
expectError<boolean>(exists<string>(numberTree, '', cmpStrings));
expectError<number>(find<number>(stringTree, 0, cmpNumbers, 0));
expectError<Generator<number, undefined, undefined>>(findAll<number>(stringTree, 0, cmpNumbers));
expectError<number>(findBy<number>(stringTree, (treeValue: number) => cmpStrings(treeValue, 0), 0));
expectError<types.ImmutableTree<string> | null>(findNode<number>(stringTree, '', cmpStrings));
expectError<[number, number]>(findWithIndex<number>(stringTree, 0, cmpNumbers, 0));
expectError<types.ImmutableTree<number>>(fromDistinctAscArray<number>(['']));
expectError<types.NonEmptyImmutableTree<number>>(join<number>(stringTree, 0, stringTree));
expectError<types.ImmutableTree<number>>(join2<number>(stringTree, stringTree));
expectError<types.ImmutableTree<string>>(map<number, string>(stringTree, toString));
expectError<number>(maxValue<number>(stringTree));
expectError<number>(minValue<number>(stringTree));
expectError<types.ImmutableTree<number>>(remove<number, number>(stringTree, 0, cmpNumbers));
expectError<types.ImmutableTree<number>>(removeIfExists<number, number>(stringTree, 0, cmpNumbers));
expectError<types.ImmutableTree<number>>(removeOrThrowIfNotExists<number, number>(stringTree, 0, cmpNumbers));
expectError<types.ImmutableTree<number>>(setIndex(stringTree, 0, 42));
expectError<types.ImmutableTree<number>>(slice(stringTree, 1, 2));
expectError<SpliceResult<number>>(splice(stringTree, 1, 2, numberTree));
expectError<SplitResult<number>>(split<number>(stringTree, 1, cmpNumbers));
expectError<{readonly tree: types.ImmutableTree<number>; readonly value: number}>(splitFirst<number>(numberTree));
expectError<{readonly tree: types.ImmutableTree<number>; readonly value: number}>(splitLast<number>(numberTree));
expectError<ReadonlyArray<string>>(toArray<string>(numberTree));
expectError<types.ImmutableTree<number>>(union<number>(stringTree, stringTree, cmpNumbers));
expectError<types.ImmutableTree<number>>(difference<number>(stringTree, stringTree, cmpNumbers));
expectError<types.ImmutableTree<number>>(intersection<number>(stringTree, stringTree, cmpNumbers));
expectError<types.ImmutableTree<number>>(symmetricDifference<number>(stringTree, stringTree, cmpNumbers));
expectError<Generator<[string | undefined, number | undefined], undefined, undefined>>(zip(numberTree, stringTree));

// Wrong comparator function type
expectError<types.ImmutableTree<string>>(equals<string>(stringTree, stringTree, areNumbersEqual));
expectError<boolean>(exists<string>(stringTree, '', cmpNumbers));
expectError<string>(find<string>(stringTree, '', cmpNumbers, ''));
expectError<Generator<string, undefined, undefined>>(findAll<string>(stringTree, '', cmpNumbers));
expectError<string>(findNext<string>(stringTree, '', cmpNumbers, ''));
expectError<types.ImmutableTree<string> | null>(findNode<string>(stringTree, '', cmpNumbers));
expectError<string>(findPrev<string>(stringTree, '', cmpNumbers, ''));
expectError<[string, number]>(findWithIndex<string>(stringTree, '', cmpNumbers, ''));
expectError<types.ImmutableTree<string>>(insert<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string>>(remove<string, string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string>>(removeIfExists<string, string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string>>(removeOrThrowIfNotExists<string, string>(stringTree, '', cmpNumbers));
expectError<SplitResult<string>>(split<string>(stringTree, '', cmpNumbers));
expectError<types.ImmutableTree<string>>(union<string>(stringTree, stringTree, cmpNumbers));
expectError<types.ImmutableTree<string>>(difference<string>(stringTree, stringTree, cmpNumbers));
expectError<types.ImmutableTree<string>>(intersection<number>(stringTree, stringTree, cmpNumbers));
expectError<types.ImmutableTree<string>>(symmetricDifference<string>(stringTree, stringTree, cmpNumbers));

// Wrong 'mapper' function type.
expectError<types.ImmutableTree<string>>(map<number, string>(numberTree, (x: string) => parseInt(x, 10)));

// Value type override + wrong comparator function type
expectError<string>(find<string, number>(stringTree, 0, cmpStrings, ''));
expectError<Generator<string, undefined, undefined>>(findAll<string, number>(stringTree, 0, cmpStrings));
expectError<string>(findNext<string, number>(stringTree, 0, cmpStrings, ''));
expectError<string>(findPrev<string, number>(stringTree, 0, cmpStrings, ''));
expectError<[string, number]>(findWithIndex<string, number>(stringTree, 0, cmpStrings, ''));

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

expectType<typeof at>(wbt.at);
expectType<typeof create>(wbt.create);
expectType<typeof difference>(wbt.difference);
expectType<typeof empty>(wbt.empty);
expectType<typeof equals>(wbt.equals);
expectType<typeof exists>(wbt.exists);
expectType<typeof filter>(wbt.filter);
expectType<typeof find>(wbt.find);
expectType<typeof findAll>(wbt.findAll);
expectType<typeof findBy>(wbt.findBy);
expectType<typeof findNext>(wbt.findNext);
expectType<typeof findNode>(wbt.findNode);
expectType<typeof findPrev>(wbt.findPrev);
expectType<typeof findWithIndex>(wbt.findWithIndex);
expectType<typeof fromDistinctAscArray>(wbt.fromDistinctAscArray);
expectType<typeof indexOf>(wbt.indexOf);
expectType<typeof insert>(wbt.insert);
expectType<typeof insertIfNotExists>(wbt.insertIfNotExists);
expectType<typeof insertOrReplaceIfExists>(wbt.insertOrReplaceIfExists);
expectType<typeof insertOrThrowIfExists>(wbt.insertOrThrowIfExists);
expectType<typeof intersection>(wbt.intersection);
expectType<typeof iterate>(wbt.iterate);
expectType<typeof join>(wbt.join);
expectType<typeof join2>(wbt.join2);
expectType<typeof map>(wbt.map);
expectType<typeof maxValue>(wbt.maxValue);
expectType<typeof minValue>(wbt.minValue);
expectType<typeof remove>(wbt.remove);
expectType<typeof removeIfExists>(wbt.removeIfExists);
expectType<typeof removeOrThrowIfNotExists>(wbt.removeOrThrowIfNotExists);
expectType<typeof reverseIterate>(wbt.reverseIterate);
expectType<typeof setDelta>(wbt.setDelta);
expectType<typeof setIndex>(wbt.setIndex);
expectType<typeof slice>(wbt.slice);
expectType<typeof splice>(wbt.splice);
expectType<typeof split>(wbt.split);
expectType<typeof splitFirst>(wbt.splitFirst);
expectType<typeof splitIndex>(wbt.splitIndex);
expectType<typeof splitLast>(wbt.splitLast);
expectType<typeof symmetricDifference>(wbt.symmetricDifference);
expectType<typeof toArray>(wbt.toArray);
expectType<typeof union>(wbt.union);
expectType<typeof update>(wbt.update);
expectType<typeof validate>(wbt.validate);
expectType<typeof zip>(wbt.zip);
