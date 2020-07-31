export interface ResultBuilder<R, T, E = Error> {
  success(data: T): R;
  failure(error: E): R;
}

export interface TaskWithResult<T, E = Error> {
  execute<R>(result: ResultBuilder<R, T, E>): R;
}

export interface Control<T> {
  execute<R>(result: ResultBuilder<R, T>): R;
}
