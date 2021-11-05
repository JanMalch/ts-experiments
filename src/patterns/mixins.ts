import { Class } from '@ts-experiments/types/misc';

/* eslint-disable */
export function Mixin(...baseCtors: Class<unknown>[]) {
  return function (derivedCtor: any): void {
    baseCtors.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        Object.defineProperty(
          derivedCtor.prototype,
          name,
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name)!
        );
      });
    });
  };
}
/* eslint-enable */
