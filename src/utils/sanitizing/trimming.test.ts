import {
  trimArray,
  trimObject,
  trimObjectLiteral,
} from '@ts-experiments/utils/sanitizing/trimming';

describe('trimArray', () => {
  it('should trim all items in an array', () => {
    const actual = trimArray([1, ' 2', '3', false, ' 5   ']);
    expect(actual).toEqual([1, '2', '3', false, '5']);
  });

  it('should throw an error for non-array types', () => {
    const input = [false, ' a string   ', 23, new Date(), { a: '  value ' }];
    input.forEach((nonArrayInput) => {
      const actual = trimArray(nonArrayInput as any); // TypeScript beschwert sich schon, daher any-cast ...
      expect(actual).toEqual(nonArrayInput as any); // unverändert
    });
  });
});

// TODO: change test values

describe('trimObjectLiteral', () => {
  it('should trim all string fields', () => {
    const actual = trimObjectLiteral({
      name: '   Bank ',
      id: 2,
      strasse: 'Bankstraße 42 ',
    });

    expect(actual).toEqual({
      name: 'Bank',
      id: 2,
      strasse: 'Bankstraße 42',
    });
  });

  it('should create a new object', () => {
    const input = {
      name: '   Bank ',
    };
    const actual = trimObjectLiteral(input);

    // richtiger Inhalt
    expect(actual).toEqual({
      name: 'Bank',
    });
    // aber neues Objekt
    expect(actual).not.toBe(input);
  });

  it('should work with nested objects', () => {
    const actual = trimObjectLiteral({
      name: '   Bank ',
      nested: {
        id: 2,
        strasse: 'Bankstraße 42 ',
      },
    });

    expect(actual).toEqual({
      name: 'Bank',
      nested: {
        id: 2,
        strasse: 'Bankstraße 42',
      },
    });
  });

  it('should trim items in nested arrays', () => {
    const actual = trimObjectLiteral({
      name: '   Bank ',
      items: [
        0,
        1,
        '2 ',
        ['  3 ', 4],
        {
          id: 2,
          strasse: 'Bankstraße 42 ',
        },
      ],
    });

    expect(actual).toEqual({
      name: 'Bank',
      items: [
        0,
        1,
        '2',
        ['3', 4],
        {
          id: 2,
          strasse: 'Bankstraße 42',
        },
      ],
    });
  });

  it('should not affect non-object-literals', () => {
    const now = new Date();

    const actual = trimObjectLiteral({
      name: '   Bank ',
      nested: {
        strasse: 'Bankstraße 42 ',
      },
      timestamp: now,
      flag: true,
    });

    expect(actual).toEqual({
      name: 'Bank',
      nested: {
        strasse: 'Bankstraße 42',
      },
      timestamp: now,
      flag: true,
    });
  });

  it('should work with null and undefined values', () => {
    const actual = trimObjectLiteral({
      name: '   Bank ',
      id: null,
      strasse: undefined,
    });

    expect(actual).toEqual({
      name: 'Bank',
      id: null,
      strasse: undefined,
    });
  });

  it('should not trim keys', () => {
    const actual = trimObjectLiteral({
      ' name': '   Bank ',
    });

    expect(actual).toEqual({
      ' name': 'Bank',
    });
  });

  it('should not work with other objects', () => {
    const now = new Date();
    const actual = trimObjectLiteral(now);
    expect(actual).toEqual(now);
  });
});

describe('trimObject', () => {
  class Auto {
    constructor(public kennzeichen: string) {}

    public getKennzeichen(): string {
      return this.kennzeichen;
    }
  }

  it('should keep prototype', () => {
    const myAuto = new Auto('    BK-HN-123 ');
    const updatedAuto = trimObject(myAuto);
    expect(myAuto).toBe(updatedAuto); // reference unchanged
    expect(updatedAuto instanceof Auto).toBe(true);
    expect(myAuto instanceof Auto).toBe(true);
    expect(myAuto.kennzeichen).toBe('BK-HN-123');
    expect(myAuto.getKennzeichen()).toBe('BK-HN-123'); // Methoden funktionieren weiterhin
  });
});
