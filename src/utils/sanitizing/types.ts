import { ValuesOf } from '@ts-experiments/types/collections';

/**
 * Semantischer Typ-Alias, für eine Funktion die einen input vom Typ `I` annimmt, und in den Typ `O` umwandelt.
 */
export type Sanitizer<I = any, O = I> = (input: I) => O;

/**
 * Typ-Alias für ein Objekt, welches optionale Sanitisierer für einen anderen Typ `T`  definiert.
 * Sie definieren die Regeln nach denen ein Objekt später sanitisiert wird.
 * @see Sanitizers.of
 */
export type ObjectSanitizers<T, O = T> = {
  [key in keyof (Partial<T> | Partial<O>)]: Sanitizer<T[key], O[key]>;
};

// TODO: put to use
export interface SanitizerHooks<T, O = T> {
  pre: (value: ValuesOf<T>) => ValuesOf<O>;
  fields: ObjectSanitizers<T, O>;
  post: (value: ValuesOf<T>) => ValuesOf<O>;
}
