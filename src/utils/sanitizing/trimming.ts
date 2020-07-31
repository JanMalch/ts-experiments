import { isObjectLiteral } from '@ts-experiments/collections/operations/guards';

/**
 * Trimmt jeden beliebigen Typ.
 * - `null` oder `undefined` wird unverändert zurückgegeben
 * - `string` wird getrimmt
 * - in `Array`s wird für jeden Wert diese Methode aufgerufen
 * - für Objektliterale wird `trimObjectLiteral` aufgerufen
 * - für andere Objekte wird `trimObject` aufgerufen
 * - in allen anderen Fällen wird der Wert unverändert zurückgegeben
 * @param value beliebiger Wert
 * @see trimArray
 * @see trimObjectLiteral
 * @see trimObject
 */
export function trimValue<T>(value: T): T {
  if (value == null) {
    return value;
  } else if (typeof value === 'string') {
    return (value.trim() as unknown) as T;
  } else if (Array.isArray(value)) {
    return (trimArray(value) as unknown) as T;
  } else if (isObjectLiteral(value)) {
    return trimObjectLiteral(value);
  } else if (typeof value === 'object') {
    return trimObject(value as any);
  } else {
    return value;
  }
}

/**
 * Trimmt alle Werte in einem Array mithilfe der `trimValue` Funktion.
 *
 * Ist der Wert kein Array wird er unverändert zurückgegeben.
 * @param value beliebiges Array
 * @see trimValue
 */
export function trimArray<T>(value: T[]): T[] {
  if (!Array.isArray(value)) {
    return value;
  }
  return value.map((item) => trimValue(item));
}

/**
 * Trimmt alle Felder eines einfachen Objekts mithilfe der `trimValue` Funktion.
 * Verschachelte Objekte werden ebenfalls unterstützt.
 * Die Feldernamen bleiben unverändert.
 *
 * Ist der Wert kein Objekliteral wird er unverändert zurückgegeben.
 * @param value beliebiges Objektliteral
 * @see trimValue
 */
export function trimObjectLiteral<T extends any>(value: T): T {
  if (!isObjectLiteral(value)) {
    return value;
  }

  // erzeuge Key-Value-Paare (https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
  return (
    Object.entries(value)
      .map((pair: [string, any]) => {
        // speichere ersten Wert des Paars in Variable "key", zweiten in "value" (geht auch im Methodenparameter direkt)
        // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Operators/Destrukturierende_Zuweisung
        const [key, value] = pair;
        return [key, trimValue(value)]; // Paar mit aktualisierter Value
      })
      // Das KV-Paar-Array wieder zu einem neuen Objekt zusammenfügen
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}) as T
  );
}

/**
 * Trimmt alle Felder eines Objekts mithilfe der `trimValue` Funktion.
 * Eine Kopie (in Form eines Objektliterals) aller Felder wird mit `trimObjectLiteral` getrimmt.
 * Anschließend werden die Werte wieder auf das Objekt kopiert.
 * Es wird dasselbe Objekt zurückgegeben, wie hineingegeben wurde.
 * @param value beliebiges Objekt
 * @see trimObjectLiteral
 * @see trimValue
 * @returns dasselbe Objekt mit getrimmten Feldern (referential equality)
 */
export function trimObject<T>(value: T): T {
  const asObjectLiteral = { ...value };
  const trimmedLiteral = trimObjectLiteral(asObjectLiteral as any);
  Object.assign(value, trimmedLiteral);
  return value;
}
