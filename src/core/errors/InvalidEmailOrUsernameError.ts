export class InvalidEmailOrUsernameError extends Error {
  constructor() {
    super('Invalid email or username');
  }
}
