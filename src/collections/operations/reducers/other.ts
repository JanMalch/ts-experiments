import { Reducer, VIAFn } from '@ts-experiments/types/functions';

/**
 * dont set an accumalator
 * @param valueSelector
* @author https://github.com/JanMalch/ts-experiments
 */
export function maxBy<I, O>(valueSelector: (value: I) => O): Reducer<I, I> {
  return (accumulator, currentValue) => {
    const a = valueSelector(accumulator);
    const b = valueSelector(currentValue);
    return b > a ? currentValue : accumulator;
  };
}

/**
 * dont set an accumalator
 * @param valueSelector
* @author https://github.com/JanMalch/ts-experiments
 */
export function minBy<I, O>(valueSelector: (value: I) => O): Reducer<I, I> {
  return (accumulator, currentValue) => {
    const a = valueSelector(accumulator);
    const b = valueSelector(currentValue);
    return b < a ? currentValue : accumulator;
  };
}

/**
 *
 * @param nextFn
 * @param firstFn
 * @see scan.plus
 * @see scan.concat
 * @example
 *
* @author https://github.com/JanMalch/ts-experiments
 */
export function scan<T, O = T>(
  nextFn: (
    accumulator: O,
    currentValue: T,
    currentIndex: number,
    array: T[]
  ) => O,
  firstFn?: VIAFn<T, O>
): Reducer<O[], T> {
  return (acc, curr, index, array) => {
    if (index === 0) {
      acc.push(firstFn ? firstFn(curr, index, array) : ((curr as any) as O));
      return acc;
    }
    const prev = acc[index - 1];
    acc.push(nextFn(prev, curr, index, array));
    return acc;
  };
}

const scanConcat = scan<any>(
  (prev, curr) => [...prev, curr],
  (x) => [x]
);
/**
 *
 */
scan.concat = <T>(): Reducer<T[][], T> => scanConcat;
