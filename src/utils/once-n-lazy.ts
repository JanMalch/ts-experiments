export function once(task: () => void): () => void {
  const o = new Once(task);
  return o.run.bind(o);
}

class Once {
  readonly #task: () => void;
  #hasRun = false;

  constructor(task: () => void) {
    this.#task = task;
  }

  run() {
    if (!this.#hasRun) {
      this.#hasRun = true;
      this.#task();
    }
  }
}

class Lazy<T> {
  #_value?: T;
  #hasRun = false;
  readonly #supplier: () => T;

  get value(): T {
    if (!this.#hasRun) {
      this.#hasRun = true;
      this.#_value = this.#supplier();
    }
    return this.#_value as T;
  }

  constructor(supplier: () => T) {
    this.#supplier = supplier;
  }
}

export function lazy<T>(supplier: () => T): Lazy<T> {
  return new Lazy(supplier);
}
