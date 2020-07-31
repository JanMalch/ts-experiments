export const identity = <T>(value: T): T => value;

export function plus(a: number, b: number): number;
export function plus(a: boolean, b: boolean): number;
export function plus(a: string | unknown, b: unknown): string;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function plus(a: any, b: any): any {
  return a + b;
}

plus.infix = function (infix: any) {
  return (a: any, b: any) => a + infix + b;
};

export function tuplify<A>(a: A): [A];
export function tuplify<A, B>(a: A, b: B): [A, B];
export function tuplify<A, B, C>(a: A, b: B, c: C): [A, B, C];
export function tuplify<A, B, C, D>(a: A, b: B, c: C, d: D): [A, B, C, D];
export function tuplify<A, B, C, D, E>(
  a: A,
  b: B,
  c: C,
  d: D,
  e: E
): [A, B, C, D, E];
export function tuplify<A, B, C, D, E, F>(
  a: A,
  b: B,
  c: C,
  d: D,
  e: E,
  f: F
): [A, B, C, D, E, F];
export function tuplify<T>(...values: T[]): T[] {
  return values;
}
