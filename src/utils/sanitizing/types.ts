import { ValuesOf } from '@ts-experiments/types/collections';

export type Sanitizer<I = any, O = I> = (input: I) => O;

export type ObjectSanitizers<T, O = T> = {
  [key in keyof (Partial<T> | Partial<O>)]: Sanitizer<T[key], O[key]>;
};

export interface SanitizerHooks<T, O = T> {
  pre: (value: ValuesOf<T>) => ValuesOf<O>;
  fields: ObjectSanitizers<T, O>;
  post: (value: ValuesOf<T>) => ValuesOf<O>;
}
