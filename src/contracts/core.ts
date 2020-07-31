import { Class } from '@ts-experiments/types/misc';
import {
  AssertionError,
  IllegalStateError,
  PostconditionError,
  PreconditionError,
} from './errors';

export class Contract {
  private constructor() {
    // Utils class
  }

  static requires(
    condition: boolean,
    message = 'Unmet precondition'
  ): asserts condition {
    if (!condition) {
      throw new PreconditionError(message);
    }
  }

  static requiresDefined<T>(
    value: T,
    message = 'Unmet precondition due to an undefined value'
  ): NonNullable<T> {
    Contract.requires(value != null, message);
    return value as NonNullable<T>;
  }

  static checks(
    condition: boolean,
    message = 'Callee is in an illegal state'
  ): asserts condition {
    if (!condition) {
      throw new IllegalStateError(message);
    }
  }

  static checksDefined<T>(
    value: T,
    message = 'Callee is in an illegal state due to an undefined value'
  ): NonNullable<T> {
    Contract.checks(value != null, message);
    return value as NonNullable<T>;
  }

  static ensures(
    condition: boolean,
    message = 'Unmet postcondition'
  ): asserts condition {
    if (!condition) {
      throw new PostconditionError(message);
    }
  }

  static ensuresDefined<T>(
    value: T,
    message = 'Unmet postcondition'
  ): NonNullable<T> {
    Contract.ensures(value != null, message);
    return value as NonNullable<T>;
  }

  static asserts(
    condition: boolean,
    message = 'Failed Assertion'
  ): asserts condition {
    if (!condition) {
      throw new AssertionError(message);
    }
  }

  static assertsDefined<T>(
    value: T,
    message = 'Failed Assertion due to an undefined value'
  ): NonNullable<T> {
    Contract.asserts(value != null, message);
    return value as NonNullable<T>;
  }

  /**
   *
   * @param fn
   * @param errorType
   * @param errorMessage
   * @example
   * const updateElement = (id: string, value: string) => document.getElementByID(id).setAttribute('data-foo', value);
   * function foo(myData: string) {
   *    Contract.succeeds(() => updateElement(myData, 'bar'));
   * }
   * foo('abcdef');
   * // AssertionError: A function did not execute successfully
   * // Caused by TypeError: document.getElementByID is not a function
   * //     at ...
   */
  static succeeds(
    fn: () => void,
    errorMessage = 'A function did not execute successfully',
    errorType: Class<Error> = AssertionError
  ) {
    let ok = true;
    let thrownErr: Error | undefined = undefined;
    try {
      fn();
    } catch (e) {
      thrownErr = e;
      ok = false;
    }
    if (!ok) {
      const reason =
        thrownErr === undefined
          ? ''
          : `\nCaused by ${thrownErr.name}: ${thrownErr.message}`;
      throw new errorType(errorMessage + reason);
    }
  }
}

/**
 * Always throws an error with the given message of the given type.
 * It can come in handy when assigning values with a ternary operator or the null operators.
 * @param message the error message
 * @param errorType the error class
 * @example
 * const result = foo ? 'a' : error('Something went wrong!');
 * const nestedValue = bar?.a?.b?.c ?? error('Nested value is null!');
* @author https://github.com/JanMalch/ts-experiments
 */
export function error<T>(
  message: string,
  errorType: Class<Error> = AssertionError
): T {
  throw new errorType(message);
}
