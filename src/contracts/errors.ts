export abstract class ContractError extends Error {
  protected constructor(message: string) {
    super(message);
  }
}

export class PreconditionError extends ContractError {
  constructor(message: string) {
    super(message);
    this.name = 'PreconditionError';
  }
}

export class IllegalStateError extends ContractError {
  constructor(message: string) {
    super(message);
    this.name = 'IllegalStateError';
  }
}

export class PostconditionError extends ContractError {
  constructor(message: string) {
    super(message);
    this.name = 'PostconditionError';
  }
}

export class AssertionError extends ContractError {
  constructor(message: string) {
    super(message);
    this.name = 'AssertionError';
  }
}
