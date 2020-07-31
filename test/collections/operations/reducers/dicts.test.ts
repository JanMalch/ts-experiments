import {
  associate,
  associateWith,
  groupBy,
} from '@ts-experiments/collections/operations/reducers/dicts';

describe('groupBy', () => {
  it('should group by the resulting keys', () => {
    const input = [0, 1, 2, 3, 4, 5, 6];
    const output = input.reduce(
      groupBy((x) => x < 3),
      {}
    );
    expect(output).toEqual({
      true: [0, 1, 2],
      false: [3, 4, 5, 6],
    });
  });
});

describe('associate', () => {
  it('should associate the values', () => {
    const output = [1, 2, 3].reduce(
      associate((i) => [`#${i}`, i * 2]),
      {}
    );
    expect(output).toEqual({
      '#1': 2,
      '#2': 4,
      '#3': 6,
    });
  });
});

describe('associateWith', () => {
  it('should associate the values', () => {
    const output = [1, 2, 3].reduce(
      associateWith((i) => i * 2),
      {}
    );
    expect(output).toEqual({
      '1': 2,
      '2': 4,
      '3': 6,
    });
  });
});
