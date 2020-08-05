/*
 * typed versions of Object.entries, Object.keys and Object.values
 * See also [why TS doesn't do it this way](https://github.com/Microsoft/TypeScript/issues/12870#issuecomment-266637861).
 */

export function objectEntries<T>(
  value: T
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(value) as any;
}

export function objectKeys<T>(value: T): Array<keyof T> {
  return Object.keys(value) as any;
}

export function objectValues<T>(
  value: T
): Array<T[keyof T]> {
  return Object.values(value) as any;
}
