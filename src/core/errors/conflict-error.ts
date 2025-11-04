export class ConflictError extends Error {
  constructor() {
    super('The was a conflict.');
  }
}
