import { identity } from '@ts-experiments/collections/operations/core';
import { Predicate } from '@ts-experiments/types/functions';
import { ObjectSanitizer } from './object-sanitizer';
import { ObjectSanitizers, Sanitizer, SanitizerHooks } from './types';

/**
 * Provides sanitizer functions or factories to create new ones.
 */
export class Sanitizers {
  /**
   * Symbol to mark a field for removal later on.
   * @see Sanitizers.removeIf
   */
  public static readonly MARKED_FOR_REMOVAL = Symbol(
    'Sanitizers.MARKED_FOR_REMOVAL',
  );

  /**
   * Function that will return the value unchanged.
   */
  public static unchanged: Sanitizer = (i) => i;

  /**
   * Function that will change a value to `MARKED_FOR_REMOVAL`.
   * Such values will be removed in the `ObjectSanitizer`.
   */
  public static removeIf<I>(
    removeValue: I | Predicate<I>,
  ): Sanitizer<I, I | typeof Sanitizers.MARKED_FOR_REMOVAL> {
    const predicate = (typeof removeValue === 'function'
      ? removeValue
      : (v: I) => removeValue === v) as Predicate<I>;
    return (value: I) =>
      predicate(value) ? Sanitizers.MARKED_FOR_REMOVAL : value;
  }

  /**
   * Function that turns all value that are not strictly `true` into `false`.
   */
  public static strictBinary: Sanitizer<any, boolean> = (i) => i === true;

  /**
   * Function that turns all values into booleans with the lenient conversion.
   */
  public static binary: Sanitizer<any, boolean> = (i) => !!i;

  /**
   * Creates a function that will return `null` if the argument is `null` or matches the given `nullValue`.
   * A predicate can also be used, that must match to return `null`.
   * @see Sanitizers.toNullIfOneOf
   */
  public static toNullIf<I>(
    nullValue: I | Predicate<I>,
  ): Sanitizer<I, I | null> {
    const predicate = (typeof nullValue === 'function'
      ? nullValue
      : (v: I) => nullValue === v) as Predicate<I>;
    return (value: I) => (value == null || predicate(value) ? null : value);
  }

  /**
   * Creates a function that will return `null` if the received value matches one of the given `nullValues`.
   */
  public static toNullIfOneOf<I>(...nullValues: I[]): Sanitizer<I, I | null> {
    return (value: I) =>
      value == null || nullValues.includes(value) ? null : value;
  }

  /**
   * Function that will return `null`, if the received string is blank.
   */
  public static text: Sanitizer<string, string | null> = (value: string) => {
    if (typeof value !== 'string') {
      return null;
    }
    return Sanitizers.toNullIf('')(value.trim());
  };

  /**
   * Function that will parse a string to an integer (radix 10).
   * If the result is not a number, `null` will be returned.
   */
  public static toInt: Sanitizer<string | number, number | null> = (
    value: string | number,
  ) => {
    if (typeof value === 'string' && Sanitizers.text(value) == null) {
      return null;
    }
    if (isNaN(value as number)) {
      return null;
    }
    return parseInt(value as string, 10);
  };

  /**
   * Function that will parse a string to a float.
   * If the result is not a number, `null` will be returned.
   */
  public static toFloat: Sanitizer<string | number, number | null> = (
    value: string | number,
  ) => {
    if (typeof value === 'string' && Sanitizers.text(value) == null) {
      return null;
    }
    if (isNaN(value as number)) {
      return null;
    }
    return parseFloat(value as string);
  };

  /**
   * Creates a function that will return the given `useValue` if the received value is `null`.
   */
  public static ifNullTo<I>(useValue: I): Sanitizer<I | null, I> {
    return (value: I | null) => (value == null ? useValue : value);
  }

  /**
   * Creates a function that will concatenate the given functions and pass the result from one to the next.
   */
  public static compose(sanitizers: Sanitizer[]): Sanitizer {
    return (value: any) =>
      sanitizers.reduce(
        (prevValue: any, sanFn: Sanitizer) => sanFn(prevValue),
        value,
      );
  }

  /**
   * Creates a new `ObjectSanitizer` that can sanitize an object of type `I`.
   * @example
   * interface MyForm {
   *   name: string;
   *   id: number | null;
   * }
   * const formSanitizer = Sanitizers.of<MyForm>({
   *   id: Sanitizers.toNullIf(0)
   * });
   * const formValue: MyForm = {
   *   name: "Jan",
   *   id: 0
   * };
   * const result = formSanitizer.sanitize(formValue);
   * // result.name === "Jan"
   * // result.id === null
   */
  public static of<I, O = I>(
    sanitizers: ObjectSanitizers<I, O>
  ): ObjectSanitizer<I, O> {
    return new ObjectSanitizer(sanitizers);
  }

  public static withHooks<I, O = I>(sanitizers: SanitizerHooks<I, O>) {
    return function sanitize(formValue: I): O {
      const preSani = sanitizers.pre ?? identity;
      const postSani = sanitizers.post ?? identity;
      return Object.entries(formValue)
        .map(([key, value]) => {
          const fieldSani: Sanitizer =
            (sanitizers.fields as any)?.[key] ?? identity;
          return [key, postSani(fieldSani(preSani(value)))];
        })
        .reduce((acc: any, [key, value]) => {
          if ((value as any) !== Sanitizers.MARKED_FOR_REMOVAL) {
            acc[key] = value;
          }
          return acc;
        }, {}) as O;
    };
  }
}
