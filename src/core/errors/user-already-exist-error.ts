export class UserAlreadyExistError extends Error {
  constructor() {
    super('Email or username already exist');
  }
}
