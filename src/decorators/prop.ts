/*
 * A decorator to quickly create getter and setter for your class properties.
 * The setter supports mapping (e.g. for sanitization) and validation.
 *
 * [Playground Link](https://www.typescriptlang.org/play/?experimentalDecorators=true#code/MYewdgzgLgBAlgEwKZinKBPGBeGAeAFQD4AKANwEMAbAVyQC4YCBKRgnImS2pAbgCgAZjTDA04eBADyAIwBWSMQBl0SAE7US-GF2p1GIgNZgQAdzD9WunpJgAlRSDUI80NXDABzADQwjJ804Ab20YNSQoGjUwazoYAEJcMBoqKhgAMnSYWQUxADpPCIAFNRAoMowAByQpQXI9JGYcbFwcxSg8ytLyzGqBAF9+XqQYAGFwCBoAW3VCTlx6njYm7E4yEEQBIaqRgGUIqFmCXwBpGCQAD0OwBAgYQyQMEEEmHHvH56Z5mEX9GAowBgVpwCABtE4AXQEwxg+yghzUUkq4kghFO5yuKFu7yeL3YuAeuK+OFCAB9YQcjqciGSYCEdAyYFMKJUAPyMOEItEwE5EASMnTcRAUQ7ssYTaazAEYPmhHT9XgwAD0SteuGlMBkigoNAgIwIuxgwABsA8gnUMCgAAsRjCMBF+PwlQAqZ3aZ0wAAijg05TUlpAMGQgg8IwoMC6IGqakwMFM6CtlptME8cDIKBgevhFqjKIg7pgAAFKhQNFNM5T-daRlmETBhKIUTAnM3kXAJgXCzrrS2rfDKhB6CrU9aaDI8qApkqAFIAgCy1GAVqVUAgAFpLtG4DNUPmYM6lUIRGJ2zESlHCG9pejLtdsYTPvicY-SKFa+oxZz1Ei89zeZY6VCcJImiH4oFLQooDYXxI2jTATkeRgTmBQDGVASBYCzAAxGJsDlBkSDgaR5HaFQEU0d81CaVkfko-47mlZg8mZSoYEYSjqJoxAUDQTB+QZNp8mDUNzzgjASHAtRIJg0oxIQjBfHpAVIJIKwNSUgUwgiKIYmtIjQQAAwAfQAEiCWD1Hgx48nKXYoHcLxVP6AyoXw+VvDcisoF+Bh-kBKx1kQVDNPgF4SBIOiKAY-zWTyIUEBFRpgpC0KfniCLK3ovygTi6hhUOHzmCaDSUuVVUnhoJk4E8Ps4xNAMk1KUw-PONRSn9G1wk8zTgJ0-iUsGAbuqTfTjLMiyYwweSbJAOyHM8JyXLebCwEK-qGX6DzGX6Zh+IVfhBn4YAqCiu4sJAQMlMLUSSAuDgYDuj0ACYmgoRhkimLV-VwAAGfjrtkkgSvixLGDu1YHpgTgAEYfp+0Ids1d7pi+t4-oOx10Oges3jAJBmvOkBVIEQQ8nDXAABYBCxkAqCQPIqBABbSYoXajomWn6cZ5m8hkNnSZkN5Yae6mObphmmZIAX+d5t4AE45dFyBOYlnm+d4IA)
 */

import { identity } from '@ts-experiments/collections/operations/core';
import { isObjectLiteral } from '@ts-experiments/types/guards';
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
 */
export function Prop<T = any, K extends keyof T = keyof T>(
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
          if (!(setter as any).validate(value)) {
            // you might want to throw an error here
            return;
          }
        }
        this[`_${propertyKey.toString()}`] = setFn(value);
      },
    });
  };
}
