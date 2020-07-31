import { Sanitizers } from './sanitizers';
import { ObjectSanitizers, Sanitizer } from './types';

/**
 * Instanzen eines `ObjectSanitizer` sanitisieren einen bestimmten Objekt-Typ.
 * Eine Instanz wird einem `ObjectSanitizers` Objekt intialisiert und somit die Regeln definiert.
 * Anschließend können entsprechende Eingabeobjekt mit der `sanitize` Funktion sanitisiert werden.
 * @see Sanitizers.of
* @author https://github.com/JanMalch/ts-experiments
 */
export class ObjectSanitizer<I, O = I> {
  /**
   * Erzeugt eine neue Instanz.
   * @param formSanitizers `ObjectSanitizers` Objekt, welches die Regeln definiert.
   */
  constructor(private readonly formSanitizers: ObjectSanitizers<I, O>) {}

  /**
   * Sanitisiert das Eingabeobjekt mit den, durch die Instanz definierten, `ObjectSanitizers`.
   * @param formValue das Eingabeobjekt
   */
  public sanitize(formValue: I): O {
    return Object.entries(formValue)
      .map(([key, value]) => {
        const matchingSanitizer: Sanitizer = (this.formSanitizers as any)[key];
        if (!matchingSanitizer) {
          return [key, value];
        }
        return [key, matchingSanitizer(value)];
      })
      .reduce((acc: any, [key, value]) => {
        if (value !== Sanitizers.MARKED_FOR_REMOVAL) {
          acc[key] = value;
        }
        return acc;
      }, {}) as O;
  }
}
