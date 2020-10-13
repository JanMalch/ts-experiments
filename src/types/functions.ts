export type Supplier<T> = () => T;
export type Consumer<T> = (value: T) => void;
export type BiConsumer<A, B = A> = (valueA: A, valueB: B) => void;
export type Task = () => void;
export type Mapper<T, O> = (value: T) => O;
export type Predicate<T> = (value: T) => boolean;
export type BiPredicate<T> = (a: T, b: T) => boolean;
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

export type ObjectMapper<
  T extends Record<string, unknown>,
  O extends Record<string, unknown> = T
> = Mapper<T, O>;

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
