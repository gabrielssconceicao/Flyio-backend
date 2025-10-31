export class ExistingUserError extends Error {
  constructor() {
    super('User already exists');
  }
}
