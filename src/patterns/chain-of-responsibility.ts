export abstract class Handler<H, T> {
  private successor: Handler<H, T> | undefined;
  protected abstract canHandle(value: H): boolean;
  protected abstract onHandle(value: H): T;

  setSuccessor(successor: Handler<H, T>) {
    this.successor = successor;
  }

  handle(value: H): T {
    if (this.canHandle(value)) {
      return this.onHandle(value);
    }
    if (this.successor != null) {
      return this.successor.handle(value);
    }
    throw new Error(
      `No handler found that can handle the value ${JSON.stringify(value)}`
    );
  }
}

export abstract class DefaultHandler<H, T> extends Handler<H, T> {
  protected canHandle(value: H): boolean {
    return true;
  }
}

export function chainOfResponsibility<H, T>(
  ...handlers: Handler<H, T>[]
): Handler<H, T> {
  handlers.forEach((value, index) => {
    value.setSuccessor(handlers[index + 1]);
  });

  return handlers[0];
}
