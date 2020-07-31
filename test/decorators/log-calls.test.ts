import { LogCalls } from '@ts-experiments/decorators/log-calls';

class Calculator {
  @LogCalls()
  sum(array: number[]): number {
    return array.reduce((sum, curr) => sum + curr, 0);
  }
}
describe('LogCalls', () => {
  it('should log the given call', () => {
    // TODO: actually test
    const arr = Array(10)
      .fill(0)
      .map((_, i) => i);
    new Calculator().sum(arr);
  });
});
