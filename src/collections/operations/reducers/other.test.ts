import { identity, plus } from '@ts-experiments/collections/operations/core';
import {
  maxBy,
  minBy,
  scan,
} from '@ts-experiments/collections/operations/reducers/other';

describe('maxBy', () => {
  it('should find the max value', () => {
    const max = [3, 2, 5, 1, 4].reduce(maxBy(identity));
    expect(max).toBe(5);
  });
});

describe('minBy', () => {
  it('should find the min value', () => {
    const min = [3, 2, 5, 1, 4].reduce(minBy(identity));
    expect(min).toBe(1);
  });
});

describe('scan', () => {
  it('should scan with the plus operator', () => {
    const input = [1, 2, 3, 4, 5];
    const result = input.reduce(scan(plus), []);
    expect(result).toEqual([1, 3, 6, 10, 15]);
  });
  it('should scan with plus.infix operator', () => {
    const segments = 'an/example/for/scan/usage'.split('/');
    const result = segments.reduce(scan(plus.infix('/')), []);
    expect(result).toEqual([
      'an',
      'an/example',
      'an/example/for',
      'an/example/for/scan',
      'an/example/for/scan/usage',
    ]);
  });
  describe('scan.concat', () => {
    it('should create subarrays', () => {
      const segments = 'an/example/for/scan-and-plus/usage'.split('/');
      const result = segments.reduce(scan.concat(), []);
      expect(result).toEqual([
        ['an'],
        ['an', 'example'],
        ['an', 'example', 'for'],
        ['an', 'example', 'for', 'scan-and-plus'],
        ['an', 'example', 'for', 'scan-and-plus', 'usage'],
      ]);
    });
  });
});
