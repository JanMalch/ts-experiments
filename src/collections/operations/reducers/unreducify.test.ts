import { partition } from '@ts-experiments/collections/operations/reducers/arrays';
import { unreducify } from '@ts-experiments/collections/operations/reducers/util';

describe('unreducify', () => {
  it('should turn a Reducer in a standalone function', () => {
    const original = partition((x: number) => x % 2);
    const standalone = unreducify(original, () => []);
    const [oEven, oOdd] = [1, 2, 3, 4, 5].reduce(original, []);
    const [sEven, sOdd] = standalone([1, 2, 3, 4, 5]);
    expect(oEven).toEqual([2, 4]);
    expect(oEven).toEqual(sEven);
    expect(oOdd).toEqual([1, 3, 5]);
    expect(oOdd).toEqual(sOdd);
  });
});

// [1, 2, 3, 4, 5].reduce(partition(x => x % 2), []);
// partition((x: number) => x % 2)([1,2,3,4,5])
// const evenPartitioning = partition((x: number) => x % 2)
// evenPartitioning([1,2,3,4,5])
