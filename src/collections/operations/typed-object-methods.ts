/*
 * typed versions of Object.entries, Object.keys and Object.values
 */

export function objectEntries<T, K extends keyof T = keyof T>(
  value: T
): Array<[K, T[K]]> {
  return Object.entries(value) as any;
}


export function objectKeys<T, K extends keyof T = keyof T>(
  value: T
): K[] {
  return Object.keys(value) as any;
}


export function objectValues<T, K extends keyof T = keyof T>(
  value: T
): Array<T[K]> {
  return Object.values(value) as any;
}

