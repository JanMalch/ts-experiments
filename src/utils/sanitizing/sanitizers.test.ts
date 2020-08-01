import { Sanitizers } from '@ts-experiments/utils/sanitizing/sanitizers';

interface MyForm {
  myNumber: number | null;
  parsedNumber: number | string;
  onlyPositiveNumbers: number | null;
  emptyAsNullString: string | null;
  untouchedString: string | null;
  multipleAsNull: string | null;
  textToZero: string | number;
}

// TODO: rework types

describe('Sanitizers', () => {
  describe('built-in Sanitizers', () => {
    describe('unchanged', () => {
      it('should return a value as is', () => {
        const sanitizer = Sanitizers.unchanged;
        const result = sanitizer('Test');
        expect(result).toBe('Test');
      });
    });

    describe('strictBinary', () => {
      it('should should return true only for true', () => {
        const inputs = [true, false, 'true', '', 1, 0];
        const expected = [true, false, false, false, false, false];
        const actual = inputs.map(Sanitizers.strictBinary);
        expect(actual).toEqual(expected);
      });
    });

    describe('binary', () => {
      it('should should return true for multiple values', () => {
        const inputs = [true, false, 'true', '', 1, 0];
        const expected = [true, false, true, false, true, false];
        const actual = inputs.map(Sanitizers.binary);
        expect(actual).toEqual(expected);
      });
    });

    describe('text', () => {
      it('should return acceptable values as is', () => {
        const sanitizer = Sanitizers.text;
        const result = sanitizer('Test');
        expect(result).toBe('Test');
      });

      /*it('should return null for null', () => {
        const sanitizer = Sanitizers.text;
        const result = sanitizer(null);
        expect(result).toBeNull();
      });*/

      it('should return null for empty string', () => {
        const sanitizer = Sanitizers.text;
        const result = sanitizer('');
        expect(result).toBeNull();
      });

      it('should return null for blank string', () => {
        const sanitizer = Sanitizers.text;
        const result = sanitizer('   ');
        expect(result).toBeNull();
      });

      it('should return null for non-string types', () => {
        const sanitizer = Sanitizers.text;
        const result = sanitizer(5 as any);
        expect(result).toBeNull();
      });
    });

    describe('toInt', () => {
      it('should parse a string as a number or null', () => {
        const sanitizer = Sanitizers.toInt;
        expect(sanitizer('4')).toBe(4);
        expect(sanitizer('-4')).toBe(-4);
        expect(sanitizer('')).toBeNull();
        expect(sanitizer('asd')).toBeNull();
        expect(sanitizer('aaaa4')).toBeNull();
      });

      it('should leave numbers as they are', () => {
        const sanitizer = Sanitizers.toInt;
        expect(sanitizer(0)).toBe(0);
      });
    });

    describe('toFloat', () => {
      it('should parse a string as a number or null', () => {
        const sanitizer = Sanitizers.toFloat;
        expect(sanitizer('4')).toBe(4);
        expect(sanitizer('4.5')).toBe(4.5);
        expect(sanitizer('-4')).toBe(-4);
        expect(sanitizer('')).toBeNull();
        expect(sanitizer('asd')).toBeNull();
        expect(sanitizer('aaaa4')).toBeNull();
      });

      it('should leave numbers as they are', () => {
        const sanitizer = Sanitizers.toFloat;
        expect(sanitizer(0)).toBe(0);
      });
    });
  });

  describe('higher-order Sanitizers', () => {
    describe('toNullIf', () => {
      it('should check against a single value', () => {
        const sanitizer = Sanitizers.toNullIf('A');
        const result = sanitizer('A');
        expect(result).toBeNull();
      });

      it('should check with a predicate function', () => {
        const sanitizer = Sanitizers.toNullIf((x: number) => x < 0);
        const result = sanitizer(-5);
        expect(result).toBeNull();
      });
    });

    describe('toNullIfOneOf', () => {
      it('should check against multiple values and return unchanged value', () => {
        const sanitizer = Sanitizers.toNullIfOneOf('A', 'B', 'C');
        const result = sanitizer('unchanged');
        expect(result).toBe('unchanged');
      });

      it('should check against multiple values and return null', () => {
        const sanitizer = Sanitizers.toNullIfOneOf('A', 'B', 'C');
        const result = sanitizer('B');
        expect(result).toBeNull();
      });
    });

    describe('ifNullTo', () => {
      it('should turn null into the given value', () => {
        const sanitizer = Sanitizers.ifNullTo('<default>');
        const result = sanitizer(null);
        expect(result).toBe('<default>');
      });

      it('should change non-null values', () => {
        const sanitizer = Sanitizers.ifNullTo('<default>');
        const result = sanitizer('Test');
        expect(result).toBe('Test');
      });
    });

    describe('compose', () => {
      it('should chain multiple Sanitizers', () => {
        const sanitizer = Sanitizers.compose([
          Sanitizers.toNullIf('x'),
          Sanitizers.ifNullTo(10),
        ]);
        const result = sanitizer('x');
        expect(result).toBe(10);
      });
    });

    describe('removeIf', () => {
      it('should set value as MARKED_FOR_REMOVAL', () => {
        const sanitizer = Sanitizers.removeIf(' ');
        const result = sanitizer(' ');
        expect(result).toEqual(Sanitizers.MARKED_FOR_REMOVAL);
      });

      /*it('should remove from final object', () => {
        const sanitizer = Sanitizers.of<{}>({
          name: Sanitizers.removeIf(' '),
        });
        const result = sanitizer.sanitize({ name: ' ' });
        expect(result).toEqual({});
      });*/
    });
  });

  describe('ObjectSanitizer', () => {
    /*it('should sanitize an object literal', () => {
      const sanitizer = Sanitizers.of<
        Record<string, any>
      >({
        name: Sanitizers.text,
      });
      const result = sanitizer.sanitize({ name: ' ' });
      expect(result).toEqual({ name: null });
    });*/
  });

  describe('use cases', () => {
    it('sanitize a form', () => {
      const rawFormValue: MyForm = {
        myNumber: 0,
        parsedNumber: '5',
        onlyPositiveNumbers: -1,
        emptyAsNullString: '   ',
        untouchedString: 'Bleibt so',
        multipleAsNull: 'that',
        textToZero: ' x ',
      };

      /* const myFormSanitizer = Sanitizers.of<MyForm>({
        myNumber: Sanitizers.toNullIf(0),
        parsedNumber: Sanitizers.toInt,
        onlyPositiveNumbers: Sanitizers.toNullIf((x: number) => x < 0),
        emptyAsNullString: Sanitizers.text,
        // untouchedString // Alle Felder sind grundsätzlich optional, neue können nicht hinzugefügt werden
        multipleAsNull: Sanitizers.toNullIfOneOf('this', 'that'),
        textToZero: Sanitizers.compose([
          Sanitizers.toInt,
          Sanitizers.ifNullTo(0),
        ]),
      });

      const actual = myFormSanitizer.sanitize(rawFormValue);

      const expected: MyForm = {
        myNumber: null,
        parsedNumber: 5,
        onlyPositiveNumbers: null,
        emptyAsNullString: null,
        untouchedString: 'Bleibt so',
        multipleAsNull: null,
        textToZero: 0,
      };

      expect(actual).toEqual(expected);*/
    });
  });
});
