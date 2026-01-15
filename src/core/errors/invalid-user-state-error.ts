export class InvalidUserStateError extends Error {
  constructor() {
    super('User is already in the requested state');
  }
}
