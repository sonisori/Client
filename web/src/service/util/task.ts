export class Task {
  private promise = Promise.resolve();
  pipe(callback: () => void) {
    this.promise = this.promise.then(callback);
  }
}
