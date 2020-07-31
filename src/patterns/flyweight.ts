import { Delegate } from './delegation';

@Delegate({
  map: Map,
})
export class Flyweight<K, V> {
  protected readonly map = new Map<K, V>();

  constructor(protected readonly factoryFn: (key: K) => V) {}

  get(key: K): V {
    if (!this.map.has(key)) {
      this.map.set(key, this.factoryFn(key));
    }
    return this.map.get(key)!;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Flyweight<K, V> extends Map<K, V> {}
