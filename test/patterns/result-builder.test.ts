import {
  Control,
  ResultBuilder,
} from '@ts-experiments/patterns/result-builder';

describe('result-builder', () => {
  interface HttpResponse<T> {
    status: number;
    payload: T | undefined;
  }

  class MyControl implements Control<string> {
    execute<R>(result: ResultBuilder<R, string>): R {
      return result.success('hooray!');
    }
  }

  class HttpResultBuilder<T> implements ResultBuilder<HttpResponse<T>, T> {
    failure(error: any): HttpResponse<T> {
      return {
        status: 500,
        payload: undefined,
      };
    }

    success(data: T): HttpResponse<T> {
      return {
        status: 200,
        payload: data,
      };
    }
  }

  it('should create difference result types', () => {
    const control = new MyControl();
    const httpBuilder = new HttpResultBuilder();
    const result = control.execute(httpBuilder);
    expect(result).toEqual({
      status: 200,
      payload: 'hooray!',
    });
  });
});
