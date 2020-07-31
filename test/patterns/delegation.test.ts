import { Delegate } from '@ts-experiments/patterns/delegation';

describe('delegate', () => {
  class Foo {
    public foo() {
      return 'foo!';
    }

    public getName() {
      return 'Foo';
    }
  }

  class Bar {
    private readonly constant = 100;

    public bar(x: number, y: number) {
      return x + y + this.constant;
    }
  }

  it('should delegate all methods to Foo', () => {
    @Delegate({ _foo: Foo })
    class Example {
      constructor(private readonly _foo: Foo) {}
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Example extends Foo {}

    const foo = new Foo();
    const example = new Example(foo);

    expect(example.foo).toBeDefined();
    expect(example.foo()).toBe('foo!');
  });

  it('should not overwrite existing methods', () => {
    @Delegate({ _foo: Foo })
    class Example {
      constructor(private readonly _foo: Foo) {}

      public getName() {
        return 'Example';
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Example extends Foo {}

    const foo = new Foo();
    const example = new Example(foo);

    expect(example.foo).toBeDefined();
    expect(example.foo()).toBe('foo!');

    expect(example.getName).toBeDefined();
    expect(example.getName()).toBe('Example');
  });

  it('should delegate to multiple classes', () => {
    @Delegate({ _foo: Foo, _bar: Bar })
    class Example {
      constructor(private readonly _foo: Foo, private readonly _bar: Bar) {}
    }

    interface Example extends Foo, Bar {}

    const foo = new Foo();
    const bar = new Bar();
    const example = new Example(foo, bar);

    expect(example.foo).toBeDefined();
    expect(example.foo()).toBe('foo!');

    expect(example.bar).toBeDefined();
    expect(example.bar(1, 2)).toBe(103);
  });

  it('should throw an error if delegate is undefined', () => {
    @Delegate({ _foo: Foo })
    class Example {
      private _foo: Foo | null = null;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Example extends Foo {}

    const example = new Example();
    expect(() => example.foo()).toThrowError(
      `Unable to use undefined delegate '_foo' of type 'Foo'`
    );
  });
});
