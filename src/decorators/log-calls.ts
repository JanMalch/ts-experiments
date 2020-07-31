/*
 * A utility decorator while developing to quickly check the inputs and outputs
 * of the annotated method.
 *
 * [Playground Link](https://www.typescriptlang.org/play/?experimentalDecorators=true#code/GYVwdgxgLglg9mABAGzgcwMIENnIM4Ay6AFMlgEYCmyAXInlAE4xhoA0iAbjiJXVmACeASkQBvAFCJEEBHjjJKAOlRpiAcgCkEdYgDUKCtX2J1NdR3WzUjGmkaVBAbmAIoAWgaDFNGFBwwEE7qwk5SMnIKyqrE3Mi8oRIAvhISoJCwCIhEmDj4pEbIAPx0DMysopLSDlAgjEjp0PBIOdi4eAAilLKMWFBwjMTh0v6MaJRQ-EJsw4gAthMAFnAAJgByWAulTCzssyuUeBDMAA79togAKoInlCsACoxwt4xQgl1Hp+cAPAKCAHzhSqzWRgBiIAYwNAsHCIAC8iAOnxgZwGSjivDC0mkoPBAH0yFRkPDDETEEUiohRuMoEpcUwQNA0WBNpQTOoAMS6AwLKDLdassL7Q7HFHndE8NkIxqZJDEJQKrBjPBTQQAbQAusDsdj6YgTg48JRGJw7gBBZUkpVoPBKOZYE7EYgAD1EcP+iAAUgBlADyayUZV2MGAghdwkSOpxcig9FGsYRL1cjHtkGUYDgAHdiJGo3rDSBkAmIcxoSzkEoHSdkGG+TA8BxrXhczq9ZQwCsSUmBqmIOmszmsXmY-rDcbTSsAEqHQvFn3+wM7VghsMFost3WRRRKexwEAnDAKMgnI0rYgEwrs+Ee7mjw7ju7TvCzjfSVRtfA5DRNxDEBzAY12z7YQLEQJtXxQdAP0IEhZh1dQf2IA17xNO4QJmKNsWQo1UJWC0bTgxAIPfPIYLUdQ11jP9KAAhw03QxBKOIqDSK-CiZyLX9sIfFYGO43CnxfIcdRI9o2JWOo+maRAWHmPBQPbTt3DjJUoAg3Eoh3J59wAUQ7QdCJqOokEo4TECSIcLOSVIWCgY1gCwPtEAAISVcRwhZLY43KNAwhSCQIDIPA8EQAAxOA4HcnUAAFWlInNZnIJVYklOhXMYYQ0rcqoowxdNWX0BF1AAQmK9QzOqCZjK4SUzJSfy9TykkxEQTy+FMT04EWMBdBSMBKEzMKIpzJQksGPLEjypQ2sK0winKoA)
 */

function logCallsLog(label: string, value: any) {
  console.log('%c' + label + ':', 'color:grey;font-style:italic;');
  console.log(value);
}

export function LogCalls(label?: string) {
  return function LogCallsDecorator(
    target: any,
    methodName: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const original = descriptor.value;
    const _label = label ?? target.constructor.name + '#' + methodName;

    descriptor.value = function (...args: any[]) {
      const preservedArgs = args.map((x) => JSON.stringify(x));
      const start = performance.now();
      const result = original.apply(this, args);
      const end = performance.now();
      const preservedResult = JSON.stringify(result);
      console.groupCollapsed(_label + ' => ' + preservedResult);
      logCallsLog('args (reference)', args);
      logCallsLog(
        'args (preserved)',
        preservedArgs
      );
      logCallsLog('result (reference)', result);
      logCallsLog('result (preserved)', preservedResult);
      logCallsLog('duration in ms', end - start);
      console.groupEnd();
      return result;
    };
  };
}
