import { ApplicationError } from '../application-error';

export class NotPostOwnerError extends ApplicationError {
  statusCode = 403;

  constructor() {
    super('You are not allowed to delete this post');
  }
}
