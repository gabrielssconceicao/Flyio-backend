import { ApplicationError } from '../application-error';

export class AlreadyFollowingError extends ApplicationError {
  statusCode = 409;
  constructor() {
    super('You are already following this user.');
  }
}
