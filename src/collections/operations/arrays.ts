/**
 * Returns a new array with the shuffled items.
 * @param input
 * @author https://stackoverflow.com/a/12646864
 */
import { strictEqual } from '@ts-experiments/collections/operations/core';
import { BiPredicate } from '@ts-experiments/types/functions';

export function shuffle<T>(input: T[]): T[] {
  const array = input.slice(0);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Creates an array of distinct values, based on the given selector function
 * @param values input values
 * @param selector function to distinct by
* @author https://github.com/JanMalch/ts-experiments
 */
export function distinctBy<T>(values: T[], selector: (element: T) => any): T[] {
  return Array.from(
    // use Map to preserve order
    values
      .reduce((acc: Map<any, T>, curr: T) => {
        acc.set(selector(curr), curr);
        return acc;
      }, new Map())
      .values()
  );
}

/**
 * Creates an array of distinct values, based on their identity
 * @param values input values
* @author https://github.com/JanMalch/ts-experiments
 */
export function distinct<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

export function hasAnyOf<T>(searched: T[], predicate: BiPredicate<T> = strictEqual) {
  return (target: T[]): boolean => {
    for (const item of target) {
      for (const search of searched) {
        if (predicate(item, search)) {
          return true;
        }
      }
    }
    return false;
  }
}
