import {
  chainOfResponsibility,
  DefaultHandler,
  Handler,
} from '@ts-experiments/patterns/chain-of-responsibility';

describe('chain-of-responsibility', () => {
  class StringHandler extends Handler<any, string> {
    protected canHandle(value: any): boolean {
      return typeof value === 'string';
    }

    protected onHandle(value: string): string {
      return 'Value is a string!';
    }
  }

  class NumberHandler extends Handler<any, string> {
    protected canHandle(value: any): boolean {
      return typeof value === 'number';
    }

    protected onHandle(value: number): string {
      return 'Value is a number!';
    }
  }

  let stringHandler: Handler<any, string>;
  let numberHandler: Handler<any, string>;

  beforeEach(() => {
    stringHandler = new StringHandler();
    numberHandler = new NumberHandler();
  });

  it('should use the first handler that can handle the value', () => {
    stringHandler.setSuccessor(numberHandler);
    const result = stringHandler.handle('test');
    expect(result).toBe('Value is a string!');
  });

  it('should pass on to the next if it cannot handle the value', () => {
    stringHandler.setSuccessor(numberHandler);
    const result = stringHandler.handle(12);
    expect(result).toBe('Value is a number!');
  });

  it('should throw an error if no handler is found', () => {
    stringHandler.setSuccessor(numberHandler);
    expect(() => stringHandler.handle([])).toThrow(
      `No handler found that can handle the value []`
    );
  });

  it('should setup a chain with util method', () => {
    const handler = chainOfResponsibility(
      stringHandler,
      numberHandler,
      new (class extends DefaultHandler<any, string> {
        // if you are lazy
        protected onHandle(value: any): string {
          return `Value is a ${typeof value}`;
        }
      })()
    );
    const result = handler.handle([]);
    expect(result).toBe('Value is a object');
  });
});
