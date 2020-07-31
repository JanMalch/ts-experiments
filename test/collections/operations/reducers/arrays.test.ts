import { partition } from '@ts-experiments/collections/operations/reducers/arrays';

describe('partition', () => {
  it('should partition based on the resulting index', () => {
    const [even, odd] = [1, 2, 3, 4, 5].reduce(
      partition((x) => x % 2),
      []
    );
    expect(even).toEqual([2, 4]);
    expect(odd).toEqual([1, 3, 5]);
  });

  describe('partition.evenly', () => {
    it('should partition evenly continuous by default', () => {
      const result = [1, 2, 3, 4, 5].reduce(partition.evenly(3), []);
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should partition evenly intermittent if specified', () => {
      const result = [1, 2, 3, 4, 5].reduce(
        partition.evenly(3, 'intermittent'),
        []
      );
      expect(result).toEqual([[1, 4], [2, 5], [3]]);
    });
  });
});
