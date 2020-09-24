import {
  arrayGuard,
  isNumber,
  recordKeysGuard,
  recordValuesGuard,
} from '@ts-experiments/types/guards';

describe('guard factories', () => {
  describe('arrayGuard', () => {
    it('should verify the type of the items', () => {
      const numberArrayGuard = arrayGuard(isNumber);
      expect(numberArrayGuard([0, 1, 2, 3])).toBe(true);
      expect(numberArrayGuard([])).toBe(true);
      expect(numberArrayGuard([0, '1', 2, 3])).toBe(false);
      expect(numberArrayGuard('not even an array')).toBe(false);
    });
  });
  describe('recordValuesGuard', () => {
    it('should verify the type of the values', () => {
      const numberValuesGuard = recordValuesGuard(isNumber);
      expect(
        numberValuesGuard({
          a: 0,
          b: 1,
        })
      ).toBe(true);
      expect(numberValuesGuard({})).toBe(true);
      expect(
        numberValuesGuard({
          a: 0,
          b: '1',
        })
      ).toBe(false);
      expect(numberValuesGuard('not even a record')).toBe(false);
    });
  });
  describe('recordKeysGuard', () => {
    it('should verify that the record has all keys', () => {
      const keysGuard = recordKeysGuard('a', 'b');
      expect(
        keysGuard({
          a: 0,
          b: 1,
        })
      ).toBe(true);
      expect(keysGuard({})).toBe(false);
      expect(
        keysGuard({
          a: 0,
        })
      ).toBe(false);
      expect(keysGuard('not even a record')).toBe(false);
    });
  });
});
