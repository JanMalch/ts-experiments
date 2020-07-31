// you can refactor this idea to work with RxJS!

export class LoadingIndicator {
  protected readonly loadingSources = new Set();

  get isLoading(): boolean {
    return this.loadingSources.size > 1;
  }

  protected startForSource(source: any) {
    this.loadingSources.add(source);
  }

  protected endForSource(source: any) {
    this.loadingSources.delete(source);
  }

  setLoading(state: boolean, source: any) {
    if (state) {
      this.startForSource(source);
    } else {
      this.endForSource(source);
    }
  }
}
