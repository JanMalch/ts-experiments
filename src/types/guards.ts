import { PickKeys } from '@ts-experiments/types/collections';
import { TypeGuard } from '@ts-experiments/types/functions';
import { Class, Falsy } from '@ts-experiments/types/misc';

export const isNumber = (x: unknown): x is number => typeof x === 'number';
export const isFiniteNumber = (x: unknown): x is number => Number.isFinite(x);
export const isString = (x: unknown): x is string => typeof x === 'string';
export const isFunction = <
  T extends (...args: any[]) => any = (...args: any[]) => any
>(
  x: unknown
): x is T => typeof x === 'function';

export function hasFunction<
  T extends Record<string, unknown>,
  K extends PickKeys<T, F>,
  F extends (...args: any[]) => any = (...args: any[]) => any
>(value: T, key: K): value is T & Record<K, F> {
  return (
    value != null &&
    Object.prototype.hasOwnProperty.call(value, key) &&
    isFunction<F>((value as any)[key])
  );
}

export function isInstanceOf<T>(clazz: Class<T>): TypeGuard<T> {
  return (value): value is T => value instanceof clazz;
}

export function isObjectLiteral(
  value: unknown
): value is Record<keyof any, unknown> {
  return value != null && Object.getPrototypeOf(value) === Object.prototype;
}

export function isRecord(value: unknown): value is Record<keyof any, unknown> {
  return value != null && typeof value === 'object';
}

export function isTruthy<T>(value: T | Falsy): value is T {
  return !!value;
}

export function isDefined<T>(value: T): value is NonNullable<T> {
  return value != null;
}

export function createArrayGuard<T>(
  itemTypeGuard: TypeGuard<T>
): TypeGuard<T[]> {
  return (value: any): value is T[] => {
    if (!Array.isArray(value)) {
      return false;
    }
    return value.every((item) => itemTypeGuard(item));
  };
}

export function createRecordValuesGuard<T>(
  valueTypeGuard: TypeGuard<T>
): TypeGuard<Record<any, T>> {
  return (value: any): value is Record<any, T> => {
    if (value == null || typeof value !== 'object') {
      return false;
    }
    return Object.values(value).every((item) => valueTypeGuard(item));
  };
}

export function createRecordKeysGuard<K extends keyof any, T = any>(
  ...keys: K[]
): TypeGuard<Record<K, T>> {
  return (data: any): data is Record<K, T> => {
    if (data == null || typeof data !== 'object') {
      return false;
    }
    return keys.every((key) => Object.prototype.hasOwnProperty.call(data, key));
  };
}

export function createRecordGuard<T extends Record<keyof any, any>>(
  guards: {
    [K in keyof T]: TypeGuard<T[K]>;
  }
): TypeGuard<T> {
  return (value: any): value is T => {
    if (!isRecord(value)) {
      return false;
    }
    return Object.entries(guards).every(([key, guard]) => guard(value[key]));
  };
}
