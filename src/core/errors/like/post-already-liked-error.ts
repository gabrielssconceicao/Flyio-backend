import { ApplicationError } from '../application-error';

export class PostAlreadyLikedError extends ApplicationError {
  statusCode = 409;

  constructor() {
    super('Post already liked');
  }
}
