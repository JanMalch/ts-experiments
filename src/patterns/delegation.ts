import { Class } from '@ts-experiments/types/misc';

// Doesn't allow access to private/protected fields
// export type Delegations<T> = {
//   [field in keyof T]: Type<any>;
// };

/**
 * Configuration of delegations
 * @example
 * ```typescript
 * {
 *   _foo: FooClass,
 *   _bar: BarClass
 * }
 * ```
 * @author https://github.com/JanMalch/ts-experiments
 */
export type Delegations = {
  [field in keyof any]: Class<any>;
};

/**
 * Class decorator to create methods on the annotated class, that delegate to the specified field.
 * @param delegations Delegation configuration
 * @typeparam T the target class
 * @example
 * ```typescript
 * import { Delegate } from 'ts-delegate';
 *
 * class Foo {
 *   foo() { return 'foo!'; }
 * }
 *
 * @Delegate({ _foo: Foo }) // specify field that acts as delegate
 * class Example {
 *  private readonly _foo = new Foo(); // must be defined
 *  // no need to declare the foo() method
 * }
 * // create interface with the same name as the class and extend interface/class
 * interface Example extends Foo {}
 *
 * const example = new Example();
 * const result = example.foo();
 * expect(result).toBe('foo!');
 * ```
 * @author https://github.com/JanMalch/ts-experiments
 */
export function Delegate<T>(delegations: Delegations /*<T>*/) {
  return (target: Class<T>) => {
    Object.entries(delegations).forEach((delegate) => {
      const [field, clazz] = delegate as [string, Class<any>];
      Object.getOwnPropertyNames(clazz.prototype).forEach((key) => {
        if (target.prototype[key] == null) {
          target.prototype[key] = function (...args: any[]) {
            if (this[field] == null) {
              throw new Error(
                `Unable to use undefined delegate '${field}' of type '${clazz.name}'`
              );
            }
            return this[field][key](...args);
          };
        }
      });
    });
  };
}
