// https://functional.christmas/2019/6

export interface Lens<A, B> {
  get: (a: A) => B;
  set: (a: A, b: B) => A;
}

export function composeLens<A, B, C>(
  ab: Lens<A, B>,
  bc: Lens<B, C>
): Lens<A, C> {
  return {
    get: (a) => bc.get(ab.get(a)),
    set: (a, c) => ab.set(a, bc.set(ab.get(a), c)),
  };
}
