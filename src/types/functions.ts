export type Supplier<T> = () => T;
export type Consumer<T> = (value: T) => void;
export type BiConsumer<A, B = A> = (valueA: A, valueB: B) => void;
export type Task = () => void;
export type Mapper<T, O> = (value: T) => O;
export type Predicate<T> = (value: T) => boolean;
export type Operator<T> = (value: T) => T;
export type TypeGuard<T> = (value: any) => value is T;
/**
 * A function to be used as the first argument for the Array#reduce method.
 * @typeparam A the type of the accumulator
 * @typeparam T the type of the current item
 * @see reduce
 */
export type Reducer<A, T> = (
  accumulator: A,
  currentValue: T,
  currentIndex: number,
  array: T[]
) => A;
export type KeySelector<T> = (value: T) => string;
export type ValueSelector<T, O> = (value: T) => O;
export type BiMapper<A, B, O> = (valueA: A, valueB: B) => O;

/**
 * Type alias for a function that compares two values for sorting purposes
 */
export type Comparator<T> = (a: T, b: T) => number;

export type ToXFn<X> = (value: any | null | undefined) => X;
export type ToStringFn = ToXFn<string>;
export type ToNumberFn = ToXFn<number>;
export type ToDateFn = ToXFn<Date>;

export type ObjectMapper<T extends {}, O extends {} = T> = Mapper<T, O>;

export type ItemIndexArrayFn<T, O> = (item: T, index: number, array: T[]) => O;

/**
 * A function that is typically used for callback arguments in Array methods.
 * VIA stands for Value-Index-Array.
 * @typeparam I the type of the values
 * @typeparam O the type of the return type
 */
export type VIAFn<I, O> = (
  currentValue: I,
  currentIndex: number,
  array: I[]
) => O;

export type KeyValueTuple<K, V> = [K, V];
export interface KeyValue<K, V> {
  key: K;
  value: V;
}

export type Falsy = false | 0 | '' | null | undefined | typeof NaN;
export type Truthy<T> = T extends Falsy ? never : T;

export type ObjectEntry<T> = KeyValueTuple<string, T>;
export type ObjectEntries<T> = Array<ObjectEntry<T>>;

/**
 * Matches any key of `T`, whose corresponding value extends the type `V`.
 * @see PickValues
 * @example
 * interface Person {
 *   id: string;
 *   name: string;
 *   age: number;
 * }
 * type FieldNameOfPersonWithStringValue = PickKeys<Person, string>;
 * // "name" | "id"
 */
export type PickKeys<T, V> = {
  [P in keyof T]: T[P] extends V ? P : never;
}[keyof T];

/**
 * Type of an object with all the fields from `T`, whose values extends the type `V`.
 * @see PickKeys
 * @example
 * interface Person {
 *   id: string;
 *   name: string;
 *   age: number;
 * }
 * type StringFieldsOfPerson = PickValues<Person, string>;
 * // { name: string, id: string }
 */
export type PickValues<T, V> = Pick<T, PickKeys<T, V>>;

/**
 * Defines a type with the same keys as T, but different value types
 */
export type SameKeys<T, V> = Record<keyof T, V>;

export type KeyOf<T> = keyof T;
export type KeysOf<T> = Array<keyof T>;
export type ValuesOf<T> = T[keyof T];
