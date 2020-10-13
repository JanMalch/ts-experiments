import { Sanitizers } from './sanitizers';
import { ObjectSanitizers, Sanitizer } from './types';

/**
 * A `ObjectSanitizer` sanitizes a certain object type `I`.
 * @see Sanitizers.of
 */
export class ObjectSanitizer<I, O = I> {
  constructor(private readonly formSanitizers: ObjectSanitizers<I, O>) {}

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
