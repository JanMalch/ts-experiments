import { Predicate } from '@ts-experiments/types/functions';

export class Queue<T> {
  protected items: T[] = [];

  peek(): T | undefined {
    return this.items[0];
  }

  poll(): T | undefined {
    return this.items.shift();
  }

  add(item: T): T {
    this.items.push(item);
    return item;
  }

  get size(): number {
    return this.items.length;
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  search(item: T): number | undefined {
    return this.items.indexOf(item);
  }

  searchByPredicate(predicate: Predicate<T>): number | undefined {
    return this.items.findIndex((item) => predicate(item));
  }
}
