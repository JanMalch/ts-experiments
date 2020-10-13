import { isObjectLiteral } from '@ts-experiments/types/guards';

/**
 * Trims any kind of type.
 * - `null` or `undefined` will be unchanged
 * - `string`s are trimmed
 * - `Array`s are mapped with `trimValue`
 * - object literals are called with `trimObjectLiteral`
 * - for other objects `trimObject`
 * - in any other case unchanged
 * @param value any value
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
 * Trims all values in the given array with `trimValue`.
 * @see trimValue
 */
export function trimArray<T>(value: T[]): T[] {
  if (!Array.isArray(value)) {
    return value;
  }
  return value.map((item) => trimValue(item));
}

/**
 * Trims all values of an object with `trimValue`.
 * Returns a new object.
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
 * Trims all fields of an object with `trimValue`. Returns the same object
 * @see trimObjectLiteral
 * @see trimValue
 */
export function trimObject<T>(value: T): T {
  const asObjectLiteral = { ...value };
  const trimmedLiteral = trimObjectLiteral(asObjectLiteral as any);
  Object.assign(value, trimmedLiteral);
  return value;
}
