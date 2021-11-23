import { Contract } from '@ts-experiments/contracts/core';

describe('core', () => {
  describe('demand', () => {
    it('should throw a PreconditionError if predicate is false', () => {
      try {
        Contract.requires(false);
        fail('Contract.requires should throw');
      } catch (e: any) {
        expect(e.name).toBe('PreconditionError');
      }
    });
  });
});
