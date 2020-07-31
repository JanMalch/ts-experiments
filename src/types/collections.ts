export interface Dictionary<T> {
  [key: string]: T;
}

export type Dict<T> = Dictionary<T>;
export type GroupDictionary<T> = Dictionary<T[]>;
export type GroupDict<T> = GroupDictionary<T>;
export type KeyValueTuple<K, V> = [K, V];
export interface KeyValue<K, V> {
  key: K;
  value: V;
}

export type ObjectEntry<T> = KeyValueTuple<string, T>;
export type ObjectEntries<T> = KeyValueTuple<string, T>[];

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

export interface KeyValue<K, V> {
  key: K;
  value: V;
}
