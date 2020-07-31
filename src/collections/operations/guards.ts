import { Falsy, PickKeys, TypeGuard } from '@ts-experiments/types/functions';

export const isNumber = (x: unknown): x is number => typeof x === 'number';
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
    value.hasOwnProperty(key) &&
    isFunction<F>((value as any)[key])
  );
}

export function isObjectLiteral(
  value: unknown
): value is Record<string, unknown> {
  return value != null && Object.getPrototypeOf(value) === Object.prototype;
}

export function isTruthy<T>(value: T | Falsy): value is T {
  return !!value;
}

export function isDefined<T>(value: T): value is NonNullable<T> {
  return value != null;
}

export function arrayGuard<T>(itemTypeGuard: TypeGuard<T>): TypeGuard<T[]> {
  return (value: any): value is T[] => {
    if (!Array.isArray(value)) {
      return false;
    }
    return value.every((item) => itemTypeGuard(item));
  };
}

export function recordValuesGuard<T>(
  valueTypeGuard: TypeGuard<T>
): TypeGuard<Record<any, T>> {
  return (value: any): value is Record<any, T> => {
    if (value == null || typeof value !== 'object') {
      return false;
    }
    return Object.values(value).every((item) => valueTypeGuard(item));
  };
}

export function recordKeysGuard<K extends keyof any, T = any>(
  ...keys: K[]
): TypeGuard<Record<K, T>> {
  return (data: any): data is Record<K, T> => {
    if (data == null || typeof data !== 'object') {
      return false;
    }
    return keys.every((key) => data.hasOwnProperty(key));
  };
}
