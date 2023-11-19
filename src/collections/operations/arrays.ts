import { strictEqual } from '@ts-experiments/collections/operations/core';
import { associate } from '@ts-experiments/collections/operations/reducers/dicts';
import { BiPredicate } from '@ts-experiments/types/functions';

/**
 * Returns a new array with the shuffled items.
 * @param input
 * @author https://stackoverflow.com/a/12646864
 */
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
 */
export function distinct<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

export function hasAnyOf<T>(
  searched: T[],
  predicate: BiPredicate<T> = strictEqual
) {
  return (target: T[]): boolean => {
    for (const item of target) {
      for (const search of searched) {
        if (predicate(item, search)) {
          return true;
        }
      }
    }
    return false;
  };
}

/**
 * Partitions `incoming` and `existing` items
 * into `created`, `updated`, `unchanged`, or `deleted`.
 * All lists but `deleted` will contain items from `incoming`.
 * @param incoming
 * @param existing
 * @param identify
 * @param isEqual
 */
export function partitionByCuud<T>(
  incoming: T[],
  existing: T[],
  identify: (item: T) => unknown,
  isEqual: (a: T, b: T) => boolean
): { deleted: T[]; created: T[]; unchanged: T[]; updated: T[] } {
  const created: T[] = [];
  const updated: T[] = [];
  const unchanged: T[] = [];

  const existingById = new Map(existing.map((item) => [identify(item), item]));

  for (const item of incoming) {
    const id = identify(item);
    const old = existingById.get(id);
    if (old !== undefined) {
      if (isEqual(item, old)) {
        unchanged.push(item);
      } else {
        updated.push(item);
      }
    } else {
      created.push(item);
    }
  }

  return {
    created,
    updated,
    unchanged,
    deleted: Array.from(existingById.values()),
  };
}
