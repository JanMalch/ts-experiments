import { objectKeys } from "@ts-experiments/collections/operations/typed-object-methods";

export function invert<T extends Record<string, unknown>>(
  value: T
): { [key: string]: keyof T } {
  return Object.keys(value).reduce((acc, key) => {
    acc[(value as any)[key]] = key;
    return acc;
  }, {} as any);
}

export function invertGroup<T>(
  value: Record<keyof any, T[]>
): { [key: string]: keyof T } {
  return Object.keys(value).reduce((acc, key) => {
    const values = value[key] as any[];
    values.forEach((v) => {
      if (!Object.prototype.hasOwnProperty.call(acc, v)) {
        acc[v] = [];
      }
      acc[v].push(key);
    });
    return acc;
  }, {} as any);
}

export function mapObjectValues<
  T extends Record<string, unknown>,
  O extends Record<string, unknown> = T,
  K extends keyof T & keyof O = keyof T & keyof O
>(mapFn: (value: T[K], key: K) => O[K]): (object: T) => O {
  return (obj) =>
    Object.entries(obj).reduce((acc, [key, value]) => {
      (acc as any)[key] = mapFn(value as any, key as any);
      return acc;
    }, {} as O);
}

export function sortGroupValues<T>(sortFn: (a: T, b: T) => number) {
  return <R extends Record<keyof any, T[]>>(groups: R): R => {
    return objectKeys(groups).reduce((acc, key) => {
      acc[key] = groups[key].sort(sortFn);
      return acc;
    }, {} as R);
  };
}
