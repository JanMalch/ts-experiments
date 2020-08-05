/**
 * Class for common String manipulation and other utils.
 * @author https://github.com/JanMalch/ts-experiments
 */
export class Strings {
  /**
   * Ensures that the output is always an array.
   * If the input already is an array it will return it. Else it will split the given input string with the given split token.
   * Useful for Inputs of directives, so users can do both `<div foo="A B C">` and `<div [foo]="['A', 'B', 'C']">`
   * @param input An array of strings or a string to split
   * @param splitToken The token to split the string with
   * @example
   * ['A', 'B', 'C'] == Strings.ensureArray('ABC', '') == Strings.ensureArray(['A', 'B', 'C'], '')
   * ['A', 'B', 'C'] == Strings.ensureArray('A, B, C', /, /g) == Strings.ensureArray(['A', 'B', 'C'], /, /g)
   */
  public static ensureArray(
    input: string | string[],
    splitToken: string | RegExp = ' '
  ): string[] {
    return Array.isArray(input) ? input : input.split(splitToken);
  }

  /**
   * Appends the given suffix to the input value, if not yet present
   * @param suffix the suffix value
   * @param input the input value
   */
  public static ensureSuffix(suffix: string, input: string): string {
    if (input.endsWith(suffix)) {
      return input;
    } else {
      return input + suffix;
    }
  }

  /**
   * Prepends the given prefix to the input value, if not yet present
   * @param prefix the prefix value
   * @param input the input value
   */
  public static ensurePrefix(prefix: string, input: string): string {
    if (input.startsWith(prefix)) {
      return input;
    } else {
      return prefix + input;
    }
  }

  /**
   * Removes the given suffix from the input value, if present
   * @param suffix the prefix value
   * @param input the input value
   */
  public static trimSuffix(suffix: string, input: string): string {
    if (input.endsWith(suffix)) {
      return input.substring(0, input.length - suffix.length);
    } else {
      return input;
    }
  }

  /**
   * Removes the given prefix from the input value, if present
   * @param prefix the prefix value
   * @param input the input value
   */
  public static trimPrefix(prefix: string, input: string): string {
    if (input.startsWith(prefix)) {
      return input.substring(prefix.length);
    } else {
      return input;
    }
  }

  /**
   * Returns the fallback value, if the input value is undefined, null, or trim() result is empty
   * In all other cases `input` will be returned as is.
   * @param fallback the fallback value
   * @param input the input value
   */
  public static ifBlank(
    fallback: string,
    input: string | undefined | null
  ): string {
    if (input == null || input.trim().length === 0) {
      return fallback;
    } else {
      return input;
    }
  }

  public static toKebabCase(input: string): string {
    return input
      .trim()
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .replace(/[^-a-z0-9]+/g, '') // remove non-alphanumeric characters
      .replace(/^-+/, '') // Remove hyphens from both ends
      .replace(/-$/, '');
  }

  public static concat(a: string, b: string): string {
    return a + b;
  }

  private constructor() {
    // util class
  }
}
