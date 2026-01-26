export class NotAllowedError extends Error {
  constructor() {
    super('Not allowed to perform this action.');
  }
}
