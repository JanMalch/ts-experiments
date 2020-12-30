import {
  invert,
  mapObjectValues, sortGroupValues
} from "@ts-experiments/collections/operations/dicts";

describe('invert', () => {
  it('should flip key and values', () => {
    const result = invert({
      a: 'x',
      b: 0,
      c: true,
      d: [1, 2, 3],
      e: { f: 'g' },
    });

    expect(result).toEqual({
      '0': 'b',
      x: 'a',
      true: 'c',
      '1,2,3': 'd',
      '[object Object]': 'e',
    });
  });
});

describe('invertGroup', () => {
  it('should invert a group record', () => {
    // TODO: find good usecase
    expect(true).toBeTruthy();
  });
});

describe('mapObjectValues', () => {
  it('should map values of the object', () => {
    const square = mapObjectValues<Record<any, number>>((v) => v * v);
    const input = { a: 1, b: 2 };
    const result = square(input);
    expect(input).not.toBe(result); // new object is returned
    expect(result).toEqual({ a: 1, b: 4 });
  });
});

describe('sortGroupValues', () => {
  it('should sort the values of a group in a dict', () => {
    const naturalOrder = (a: number, b: number) => a - b;
    const input = { a: [0, 3, 1], b: [-1, 3, 4 ]};
    const actual = sortGroupValues(naturalOrder)(input);
    expect(actual).toEqual({
      a: [0, 1, 3],
      b: [-1, 3, 4]
    });
    expect(actual).not.toBe(input);
  })
})
