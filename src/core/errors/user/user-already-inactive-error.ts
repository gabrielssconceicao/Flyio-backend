import { ApplicationError } from '../application-error';

export class UserAlreadyInactiveError extends ApplicationError {
  statusCode = 409;

  constructor() {
    super('User is already inactive');
  }
}
