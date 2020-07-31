import { Flyweight } from '@ts-experiments/patterns/flyweight';

describe('flyweight', () => {
  it('should always return a value', () => {
    const octalLookup = new Flyweight<string, number>((key) =>
      parseInt(key, 8)
    );
    spyOn(octalLookup, 'factoryFn' as any).and.callThrough();
    expect(octalLookup.get('0')).toBe(0);
    expect(octalLookup.get('10')).toBe(8);
    expect(octalLookup.get('0')).toBe(0);
    expect(octalLookup['factoryFn']).toHaveBeenCalledTimes(2);
  });
});
