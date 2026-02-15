import { ApplicationError } from '../application-error';

export class UserAlreadyActiveError extends ApplicationError {
  statusCode = 409;

  constructor() {
    super('User is already active');
  }
}
