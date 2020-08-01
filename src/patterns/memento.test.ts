import { Memento, RestorableState } from '@ts-experiments/patterns/memento';

class Originator implements RestorableState<number> {
  constructor(private data: number) {}

  set(value: number) {
    this.data = value;
  }

  createMemento(): Memento<number> {
    return new Memento(this.data);
  }

  restore(memento: Memento<number>): void {
    this.data = memento.state;
  }
}

describe('memento', () => {
  it('should create mementos and restore state', () => {
    const originator = new Originator(0);
    const initial = originator.createMemento();
    originator.set(1);
    const second = originator.createMemento();
    originator.restore(initial);
    const third = originator.createMemento();
    expect(second.state).toBe(1);
    expect(third.state).toBe(initial.state);
  });
});
