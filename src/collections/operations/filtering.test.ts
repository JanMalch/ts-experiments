import { yieldingFilter } from '@ts-experiments/collections/operations/filtering';

describe('yieldingFilter', () => {
  it('should yield the filtered values', () => {
    const evenNumbers = yieldingFilter<number>((x) => x % 2 === 0);
    const input = Array(10)
      .fill(0)
      .map((_, i) => i);
    const result = Array.from(evenNumbers(input));

    expect(result).toEqual([0, 2, 4, 6, 8]);
  });

  it('can be used for efficient pagination', () => {
    const pageIndex = 5;
    const pageSize = 10;
    const filterAndPaginate = yieldingFilter<number>(
      (x) => x % 2 === 0,
      pageSize,
      pageIndex * pageSize
    );
    const input = Array(1000000)
      .fill(0)
      .map((_, i) => i);
    const result = Array.from(filterAndPaginate(input));

    expect(result.length).toBe(pageSize);
    expect(result).toEqual([50, 52, 54, 56, 58, 60, 62, 64, 66, 68]);
  });
});
