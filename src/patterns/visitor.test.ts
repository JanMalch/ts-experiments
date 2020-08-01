import { isInstanceOf } from '@ts-experiments/collections/operations/guards';
import { Visitable, Visitor, VisitIf } from '@ts-experiments/patterns/visitor';

describe('visitor', () => {
  class Foo extends Visitable<FooBarVisitor> {}

  class Bar extends Visitable<FooBarVisitor> {}

  @Visitor()
  class FooBarVisitor implements Visitor {
    visitedBar = false;
    visitedFoo = false;

    @VisitIf(isInstanceOf(Foo))
    private visitFoo(foo: Foo) {
      this.visitedFoo = true;
    }

    @VisitIf(isInstanceOf(Bar))
    private visitBar(bar: Bar) {
      this.visitedBar = true;
    }

    declare visit: (visitable: Visitable<FooBarVisitor>) => void;
  }

  xit('should visit matching visitable', () => {
    const myVisitor = new FooBarVisitor();
    const foo = new Foo();
    foo.accept(myVisitor);
    expect(myVisitor.visitedFoo).toBe(true);
    expect(myVisitor.visitedBar).toBe(false);
  });
});
