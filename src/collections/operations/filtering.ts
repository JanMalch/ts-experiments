export function yieldingFilter<T>(
  predicate: (item: T) => boolean,
  limit?: number,
  offset = 0
): (array: T[]) => Generator<T, void> {
  return function* (array: T[]) {
    if (limit == null || limit < 0 || limit > array.length) {
      limit = array.length;
    }
    let count = 0;
    let i = offset;
    while (count < limit && i < array.length) {
      if (predicate(array[i])) {
        yield array[i];
        count++;
      }
      i++;
    }
  };
}
