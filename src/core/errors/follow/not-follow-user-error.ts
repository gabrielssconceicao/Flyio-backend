import { ApplicationError } from '../application-error';

export class NotFollowingError extends ApplicationError {
  statusCode = 409;
  constructor() {
    super('You are not following this user.');
  }
}
