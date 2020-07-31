export interface WildcardConversion {
  ignoreCase?: boolean;
  replaceWith?: '\\w' | '.' | string;
  asteriskZeroMatches?: boolean;
}

export class RegExps {
  public static fromWildcard(
    wildcard: string,
    config?: WildcardConversion
  ): RegExp {
    const ignoreCase = config?.ignoreCase ?? true;
    const replaceWith = config?.replaceWith ?? '\\w';
    const asteriskZeroMatches = config?.asteriskZeroMatches ?? true;
    const regexpStr = wildcard
      .replace(/\?/g, replaceWith)
      .replace(/\*/g, `${replaceWith}${asteriskZeroMatches ? '*' : '+'}`);
    const flags = `g${ignoreCase ? 'i' : ''}`;
    return new RegExp(regexpStr, flags);
  }

  private constructor() {
    // Utils class
  }
}
