import { ApplicationError } from '@/core/errors/application-error';

export class InvalidUsernameError extends ApplicationError {
  statusCode = 400;

  constructor() {
    super('Invalid username');
  }
}
