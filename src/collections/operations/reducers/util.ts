import { Reducer } from '@ts-experiments/types/functions';

export function unreducify<A, V>(
  reducer: Reducer<A, V>,
  initialValueProducer: () => A = () => undefined as any
): (array: V[]) => A {
  return (array) => array.reduce(reducer, initialValueProducer());
}
