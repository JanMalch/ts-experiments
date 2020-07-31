export function invert<T extends Record<string, unknown>>(
  value: T
): { [key: string]: keyof T } {
  return Object.keys(value).reduce((acc, key) => {
    acc[(value as any)[key]] = key;
    return acc;
  }, {} as any);
}

export function invertGroup<T>(
  value: Record<any, T[]>
): { [key: string]: keyof T } {
  return Object.keys(value).reduce((acc, key) => {
    const values = value[key];
    values.forEach((v) => {
      if (!acc.hasOwnProperty(v)) {
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
