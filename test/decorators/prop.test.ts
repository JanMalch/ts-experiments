import { Contract } from '@ts-experiments/contracts/core';
import { PreconditionError } from '@ts-experiments/contracts/errors';
import { Prop } from '@ts-experiments/decorators/prop';

class FooBar {
  @Prop() public foo?: string;
  @Prop((i) => i * 2) public bar = 1;
  @Prop({ validate: Contract.requiresDefined }) public xyz = 0;
}

describe('prop', () => {
  it('should map given value', () => {
    const fooBar = new FooBar();
    expect(fooBar.bar).toBe(2);
    fooBar.foo = 'Hello';
    fooBar.bar = 2;
    expect(fooBar.foo).toBe('Hello');
    expect(fooBar.bar).toBe(4);
  });

  it('should validate given value', () => {
    const fooBar = new FooBar();
    fooBar.xyz = 2;
    expect(fooBar.xyz).toBe(2);
    expect(() => (fooBar.xyz = undefined as any)).toThrowError(
      PreconditionError
    );
  });
});
