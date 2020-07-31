/**
 * Returns a Reducer function, that will turn an array into an object literal.
 * All elements with the same resulting group-by-key, will be collected in an array.
 * @param keySelector function to generate a valid key for each element
 * @example
 * const input = [0, 1, 2, 3, 4, 5, 6];
 * const output = input.reduce(groupBy(x => (x < 3).toString()), {});
 * expect(output).toEqual({
 *   'true': [0, 1, 2],
 *   'false': [3, 4, 5, 6]
 * });
 */
import { Reducer, VIAFn } from '@ts-experiments/types/functions';

export function groupBy<T>(
  keySelector: VIAFn<T, any>
): Reducer<Record<any, T[]>, T> {
  // TODO: possible to specify keys based on KeySelector?
  return (
    accumulator: Record<any, T[]>,
    currentItem: T,
    currentIndex: number,
    array: T[]
  ) => {
    const key = keySelector(currentItem, currentIndex, array);
    if (accumulator.hasOwnProperty(key)) {
      accumulator[key].push(currentItem);
    } else {
      accumulator[key] = [currentItem];
    }
    return accumulator;
  };
}

/**
 * Returns a Reducer function, that will turn an array into an object literal.
 * The keys are the elements from the given array and
 * values are produced by the `valueSelector` function applied to each element.
 * If any two elements are equal, the last one gets added to the map.
 * @param valueSelector function to generate the value
 * @example
 * const output = [1, 2, 3].reduce(associateWith(i => i * 2), {});
 * expect(output).toEqual({
 *  '1': 2,
 *  '2': 4,
 *  '3': 6,
 * });
* @author https://github.com/JanMalch/ts-experiments
 */
export function associateWith<I, O>(
  valueSelector: VIAFn<I, O>
): Reducer<Record<any, O>, I> {
  return (
    accumulator: Record<any, O>,
    currentItem: I,
    currentIndex: number,
    array: I[]
  ) => {
    accumulator[currentItem as any] = valueSelector(
      currentItem,
      currentIndex,
      array
    );
    return accumulator;
  };
}

/**
 * Returns a Map where keys are elements from the given collection and
 * key-value-pairs are produced by the transform function applied to each element.
 * If any two elements are equal, the last one gets added to the map.
 * @param transform function to generate the value
 * @example
 * const output = [1, 2, 3].reduce(associate(i => ([`#${i}`, i * 2])), {});
 * expect(output).toEqual({
 *   '#1': 2,
 *   '#2': 4,
 *   '#3': 6,
 * });
* @author https://github.com/JanMalch/ts-experiments
 */
export function associate<I, O = I>(
  transform: VIAFn<I, [any, O]>
): Reducer<Record<any, O>, I> {
  return (
    acc: Record<any, O>,
    currentItem: I,
    currentIndex: number,
    array: I[]
  ) => {
    const [key, value] = transform(currentItem, currentIndex, array);
    acc[key] = value;
    return acc;
  };
}
