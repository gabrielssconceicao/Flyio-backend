import { ApplicationError } from '../application-error';

export class UserAlreadyExistError extends ApplicationError {
  statusCode = 409;
  constructor() {
    super('Email or username already exist');
  }
}
