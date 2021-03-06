/**
 * A [RFC 7807](https://tools.ietf.org/html/rfc7807) compliant object that represents an error from an HTTP API.
 */
export interface Problem {
  /**
   * A URI reference that identifies the problem type.
   * The RFC encourages that, when dereferenced, it provide human-readable documentation for the problem type.
   * When this member is not present, its value is assumed to be "about:blank".
   */
  type: string;

  /**
   * A short, human-readable summary of the problem type.
   * It SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization.
   */
  title?: string;

  /**
   * The HTTP status code generated by the origin server for this occurrence of the problem.
   */
  status?: number;

  /**
   * A human-readable explanation specific to this occurrence of the problem.
   */
  detail?: string;

  /**
   * A URI reference that identifies the specific occurrence of the problem.
   * It may or may not yield further information if dereferenced.
   */
  instance?: string;

  /**
   * Additional members that provide details for this problem type.
   * @see https://tools.ietf.org/html/rfc7807#section-3.2
   */
  [extensions: string]: unknown;
}

export const PROBLEM_CONTENT_TYPE = 'application/problem+json';

export function isProblem(value: unknown): value is Problem {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  // TODO: check if type is valid URI (can be relative!)
  return Object.prototype.hasOwnProperty.call(value, 'type');
}
