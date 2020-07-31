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
      const start = performance.now();
      const result = original.apply(this, args);
      const end = performance.now();
      const preservedResult = JSON.stringify(result);
      console.groupCollapsed(_label + ' => ' + preservedResult);
      logCallsLog('args (reference)', args);
      logCallsLog(
        'args (preserved)',
        args.map((x) => JSON.stringify(x))
      );
      logCallsLog('result (reference)', result);
      logCallsLog('result (preserved)', preservedResult);
      logCallsLog('duration in ms', end - start);
      console.groupEnd();
      return result;
    };
  };
}
