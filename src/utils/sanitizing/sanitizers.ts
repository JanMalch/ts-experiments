import { identity } from '@ts-experiments/collections/operations/core';
import { Predicate } from '@ts-experiments/types/functions';
import { ObjectSanitizer } from './object-sanitizer';
import { ObjectSanitizers, Sanitizer, SanitizerHooks } from './types';

/**
 * Bietet einen Satz von vorgefertigen Sanitizer-Funktionen, oder Funktionen um solche zu erzeugen.
 */
export class Sanitizers {
  // TODO: deutsch
  /**
   * Symbol to mark a field for removal later on.
   * @see Sanitizers.removeIf
   */
  public static readonly MARKED_FOR_REMOVAL = Symbol(
    'Sanitizers.MARKED_FOR_REMOVAL'
  );

  /**
   * Sanitisierer, der den Wert unmittelbar zurückgibt.
   */
  public static unchanged: Sanitizer = (i) => i;

  /**
   * Sanitisierer, der den Wert ggf. mit MARKED_FOR_REMOVAL überschreibt.
   * Solche Werte werden später im `ObjectSanitizer` vollständig entfernt.
   */
  public static removeIf<I>(
    removeValue: I | Predicate<I>
  ): Sanitizer<I, I | typeof Sanitizers.MARKED_FOR_REMOVAL> {
    const predicate = (typeof removeValue === 'function'
      ? removeValue
      : (v: I) => removeValue === v) as Predicate<I>;
    return (value: I) =>
      predicate(value) ? Sanitizers.MARKED_FOR_REMOVAL : value;
  }

  /**
   * Sanitisierer, der alle Werte außer `true` zu `false` wandelt.
   * Dies wird mit der strict equalit `===` bewerkstelligt.
   */
  public static strictBinary: Sanitizer<any, boolean> = (i) => i === true;

  /**
   * Sanitisierer, der die allgemeine Boolean-Konvertierung von JavaScript anwendet.
   * Dies wird mit dem not-Operator (`!!`) bewerkstelligt.
   */
  public static binary: Sanitizer<any, boolean> = (i) => !!i;

  /**
   * Erzeugt eine Sanitizer-Funktion, die `null` zurückgibt, falls der Eingabewert `null` ist,
   * oder der gegegben `nullValue` entspricht.
   * Anstelle von Werten kann eine Prädikatsfunktion verwendet werden. Wenn diese `true` zurückgibt, wird `null` verwendet.
   * @param nullValue Wert der durch `null` ersetzt werden sollen, oder eine Prädikatsfunktion
   * @see Sanitizers.toNullIfOneOf
   */
  public static toNullIf<I>(
    nullValue: I | Predicate<I>
  ): Sanitizer<I, I | null> {
    const predicate = (typeof nullValue === 'function'
      ? nullValue
      : (v: I) => nullValue === v) as Predicate<I>;
    return (value: I) => (value == null || predicate(value) ? null : value);
  }

  /**
   * Erzeugt eine Sanitizer-Funktion, die null zurückgibt, falls der Eingabewert null ist,
   * oder einer der gegegben `nullValues` entspricht.
   * @param nullValues Mögliche Werte die durch null ersetzt werden sollen
   */
  public static toNullIfOneOf<I>(...nullValues: I[]): Sanitizer<I, I | null> {
    return (value: I) =>
      value == null || nullValues.includes(value) ? null : value;
  }

  /**
   * Text-Sanitisierer, der einen string annimmt, trim() aufruft und anschließend gegen einen leeren String prüft.
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public static text: Sanitizer<string, string | null> = (value: string) => {
    if (typeof value !== 'string') {
      return null;
    }
    return Sanitizers.toNullIf('')(value.trim());
  };

  /**
   * Sanitisierer, der aus Text in eine Zahl umwandelt, mithilfe von `parseInt(x, 10)`.
   * Zahlen bleiben unverändert. Für nicht parsebare inputs wird `null` zurückgegeben.
   */
  public static toInt: Sanitizer<string | number, number | null> = (
    value: string | number
  ) => {
    if (typeof value === 'string' && Sanitizers.text(value) == null) {
      return null;
    }
    if (isNaN(value as number)) {
      return null;
    }
    return parseInt(value as string, 10);
  };

  /**
   * Sanitisierer, der aus Text in eine Zahl umwandelt, mithilfe von `parseFloat(x)`.
   * Zahlen bleiben unverändert. Für nicht parsebare inputs wird `null` zurückgegeben.
   */
  public static toFloat: Sanitizer<string | number, number | null> = (
    value: string | number
  ) => {
    if (typeof value === 'string' && Sanitizers.text(value) == null) {
      return null;
    }
    if (isNaN(value as number)) {
      return null;
    }
    return parseFloat(value as string);
  };

  /**
   * Erzeugt eine Sanitizer-Funktion, die den gegebenen Wert `useValue` zurückgibt, falls der Eingabewert `null` ist.
   * @param useValue Wert der anstelle von `null` genutzt werden soll
   */
  public static ifNullTo<I>(useValue: I): Sanitizer<I | null, I> {
    return (value: I | null) => (value == null ? useValue : value);
  }

  /**
   * Erzeugt eine neue Sanitizer-Funktion, die gegebenen Sanitizer-Funktionen verkettet und nacheinander aufruft,
   * mit dem Ergebnis des jeweils vorherigen.
   * @param sanitizers Sanitizer-Funktionen die verkettet werden
   * @see Sanitizers.toNullIfOneOf
   */
  public static compose(sanitizers: Sanitizer[]): Sanitizer {
    return (value: any) =>
      sanitizers.reduce(
        (prevValue: any, sanFn: Sanitizer) => sanFn(prevValue),
        value
      );
  }

  /**
   * Erzeugt eine neue Instanz eines `ObjectSanitizer`, der ein gesamtes Objekt vom Typ `I` (erster generic type) sanitisieren kann.
   * Für jedes Feld des Objekts kann eine Sanitizer-Funktion definiert werden. Neue Felder können nicht definiert werden.
   * @param sanitizers Objekt, das Sanitizer-Funktionen definiert
   * @usageNotes

   ```typescript
   interface MyForm {
  name: string;
  id: number | null;
}

   const formSanitizer = Sanitizers.of<MyForm>({
  id: Sanitizers.toNullIf(0)
});

   const formValue: MyForm = {
    name: "Jan",
    id: 0
};

   const result = formSanitizer.sanitize(formValue);
   // result.name === "Jan"
   // result.id === null
   ```
   */
  public static of<I, O = I>(
    sanitizers: ObjectSanitizers<I, O>
  ): ObjectSanitizer<I, O> {
    return new ObjectSanitizer(sanitizers);
  }

  public static withHooks<I, O = I>(sanitizers: SanitizerHooks<I, O>) {
    return function sanitize(formValue: I): O {
      const preSani = sanitizers.pre ?? identity;
      const postSani = sanitizers.post ?? identity;
      return Object.entries(formValue)
        .map(([key, value]) => {
          const fieldSani: Sanitizer =
            (sanitizers.fields as any)?.[key] ?? identity;
          return [key, postSani(fieldSani(preSani(value)))];
        })
        .reduce((acc: any, [key, value]) => {
          if ((value as any) !== Sanitizers.MARKED_FOR_REMOVAL) {
            acc[key] = value;
          }
          return acc;
        }, {}) as O;
    };
  }
}
