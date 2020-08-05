/**
 * Creates a nominal type of name `T` for the data type `D`.
 * @example
 * type UserId = Nominal<'UserId', number>;
 * type AddressId = Nominal<'AddressId', number>;
 * interface ApiData {
 *   userId: UserId,
 *   addressId: AddressId
 * }
 *
 * const x = data.userId * 5;        // ok
 * const y: number = data.addressId; // ok
 * data.addressId = data.userId;     // error
 * @typeparam T name of the nominal type
 * @typeparam D the actual data type
 * @author https://github.com/JanMalch/ts-experiments
 */
export type Nominal<T, D> = { _type: T } & D;

/**
 * Nominal type that indicates that the underlying data is not yet validated.
 * @see Validated
 * @see Nominal
 * @example
 * export interface MyForm { name: string; }
 * export function api(): Unvalidated<MyForm> {
 *   return { name: 'John' } as Unvalidated<MyForm>;
 * }
 * export function process(myForm: Validated<MyForm>) { }
 * export function validate(input: Unvalidated<MyForm>): Validated<MyForm> {
 *   return input as Validated<MyForm>; // do proper validation here ...
 * }
 *
 * const res = api();
 * process(res);            // error
 * process(validate(res));  // ok
 * @author https://github.com/JanMalch/ts-experiments
 */
export type Unvalidated<T> = Nominal<'Unvalidated', T>;

export type Falsy = false | 0 | '' | null | undefined | typeof NaN;
export type Truthy<T> = T extends Falsy ? never : T;

export type Class<T> = new (...args: any[]) => T;

/**
 * Nominal type that indicates that the underlying data is validated.
 * @see Unvalidated
 * @see Nominal
 * @example
 * export interface MyForm { name: string; }
 * export function api(): Unvalidated<MyForm> {
 *   return { name: 'John' } as Unvalidated<MyForm>;
 * }
 * export function process(myForm: Validated<MyForm>) { }
 * export function validate(input: Unvalidated<MyForm>): Validated<MyForm> {
 *   // do proper validation here ...
 *   return input as Validated<MyForm>;
 * }
 *
 * const res = api();
 * process(res);            // error
 * process(validate(res));  // ok
 * @author https://github.com/JanMalch/ts-experiments
 */
export type Validated<T> = Nominal<'Validated', T>;

export interface Proxy<T> {
  get(): T;

  set(value: T): void;
}

export type Unpacked<T> = T extends (infer U)[] ? U : T;

export type NotUndefined<T> = T extends undefined ? never : T;
export type Nullable<T> = T | undefined | null;
