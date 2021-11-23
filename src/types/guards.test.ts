import {
  createArrayGuard,
  isNumber,
  createRecordKeysGuard,
  createRecordValuesGuard,
  createRecordGuard,
  isString,
  isFiniteNumber,
} from '@ts-experiments/types/guards';

describe('guard factories', () => {
  describe('createArrayGuard', () => {
    it('should verify the type of the items', () => {
      const numberArrayGuard = createArrayGuard(isNumber);
      expect(numberArrayGuard([0, 1, 2, 3])).toBe(true);
      expect(numberArrayGuard([])).toBe(true);
      expect(numberArrayGuard([0, '1', 2, 3])).toBe(false);
      expect(numberArrayGuard('not even an array')).toBe(false);
    });
  });
  describe('createRecordValuesGuard', () => {
    it('should verify the type of the values', () => {
      const numberValuesGuard = createRecordValuesGuard(isNumber);
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
  describe('createRecordKeysGuard', () => {
    it('should verify that the record has all keys', () => {
      const keysGuard = createRecordKeysGuard('a', 'b');
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
  describe('createRecordsGuard', () => {
    it('should verify that both keys and values match', () => {
      const recordGuard = createRecordGuard({
        name: isString,
        age: isFiniteNumber,
      });
      expect(
        recordGuard({
          name: 'a',
          age: 1,
          extraFields: true,
        })
      ).toBe(true);
      expect(recordGuard({})).toBe(false);
      expect(
        recordGuard({
          name: '',
        })
      ).toBe(false);
      expect(
        recordGuard({
          name: 0,
        })
      ).toBe(false);
      expect(recordGuard('not even a record')).toBe(false);
    });
  });
});
