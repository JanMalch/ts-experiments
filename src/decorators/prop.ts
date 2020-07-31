import { identity } from '@ts-experiments/collections/operations/core';
import { isObjectLiteral } from '@ts-experiments/collections/operations/guards';
import { Consumer } from '@ts-experiments/types/functions';

export type Setter<T, K extends keyof T = keyof T> = (value: any) => T[K];
export type SetterOptions<T, K extends keyof T = keyof T> =
  | Setter<T, K>
  | {
      map?: Setter<T, K>;
      validate?: Consumer<any>;
    }; // T = any because TS cant infer the type yet

/**
 * Decorator to define a property with the given setter options
 * @param setter the setter function or options
 */ export function Prop<T = any, K extends keyof T = keyof T>(
  setter?: SetterOptions<T, K>
) {
  return (target: T, propertyKey: K) => {
    const setFn =
      (isObjectLiteral(setter) ? (setter as any).map : setter) ?? identity;
    Object.defineProperty(target, propertyKey, {
      get(): any {
        return this[`_${propertyKey.toString()}`];
      },
      set(value: any): void {
        if ((setter as any)?.validate) {
          (setter as any).validate(value);
        }
        this[`_${propertyKey.toString()}`] = setFn(value);
      },
    });
  };
}
