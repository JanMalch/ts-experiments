import { Class } from '@ts-experiments/types/misc';

export function Mixin(...baseCtors: Class<any>[]) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (derivedCtor: Object) {
    baseCtors.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        // TODO: !); ?
        Object.defineProperty(
          Object.getPrototypeOf(derivedCtor),
          name,
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name)!
        );
      });
    });
  };
}
