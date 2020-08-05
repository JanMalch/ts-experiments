import { Predicate } from '@ts-experiments/types/functions';
import { Class } from '@ts-experiments/types/misc';

export interface Visitor {
  visit: (visitable: Visitable) => void;
}

export abstract class Visitable<V extends Visitor = Visitor> {
  accept(visitor: V) {
    visitor.visit(this);
  }
}

/**
 * Class decorator to add visitor functionality
 * @see VisitIf
 * @example
 * class Foo extends Visitable<FooBarVisitor> {
 * }
 * class Bar extends Visitable<FooBarVisitor> {
 * }
 * \@Visitor()
 * class FooBarVisitor implements Visitor {
 *   visitedBar = false;
 *   visitedFoo = false;
 *   \@VisitIf(isInstanceOf(Foo))
 *   private visitFoo(foo: Foo) {
 *     this.visitedFoo = true;
 *   }
 *   \@VisitIf(isInstanceOf(Bar))
 *   private visitBar(bar: Bar) {
 *     this.visitedBar = true;
 *   }
 *   declare visit: (visitable: Visitable<FooBarVisitor>) => void;
 * }
 * @author https://github.com/JanMalch/ts-experiments
 */
export function Visitor<T>() {
  return function (
    target: Class<T> // The class the decorator is declared on
  ) {
    const proto = target.prototype;
    const predicates = Object.entries(proto).reduce((acc, [key, value]) => {
      const result = Reflect.get(value as any, 'visitIf');
      if (result == null) {
        return acc;
      }
      acc[key] = result;
      return acc;
    }, {} as any);
    proto.visit = function (visitable: any) {
      const match = Object.keys(predicates).find((method) =>
        predicates[method](visitable)
      );
      if (match == null) {
        throw new Error(`No visit method for ${visitable}`);
      }
      return this[match](visitable);
    };
  };
}

export function VisitIf(predicate: Predicate<any>) {
  return function (
    target: unknown,
    methodName: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    Reflect.set((<any>target)[methodName], 'visitIf', predicate);
  };
}
