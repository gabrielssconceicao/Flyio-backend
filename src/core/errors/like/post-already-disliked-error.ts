import { ApplicationError } from '../application-error';

export class PostAlreadyDislikedError extends ApplicationError {
  statusCode = 409;

  constructor() {
    super('Post already disliked');
  }
}
