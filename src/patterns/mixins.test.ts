import { Mixin } from '@ts-experiments/patterns/mixins';

describe('mixins', () => {
  // Disposable Mixin
  class Disposable {
    isDisposed = false;

    dispose() {
      this.isDisposed = true;
    }
  }

  // Activatable Mixin
  class Activatable {
    isActive = false;

    activate() {
      this.isActive = true;
    }

    deactivate() {
      this.isActive = false;
    }
  }

  @Mixin(Disposable, Activatable)
  class SmartObject {
    interact() {
      this.activate();
    }
  }

  interface SmartObject extends Disposable, Activatable {}

  xit('should mixin other classes', () => {
    const smartObj = new SmartObject();
    smartObj.interact();
    expect(smartObj.isActive).toBe(true);
  });
});
