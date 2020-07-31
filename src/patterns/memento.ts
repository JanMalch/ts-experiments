export interface RestorableState<T> {
  createMemento(): Memento<T>;
  restore(memento: Memento<T>): void;
}

export class Memento<T> {
  constructor(public readonly state: T) {}
}
