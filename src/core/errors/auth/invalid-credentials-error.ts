import { ApplicationError } from '../application-error';

export class InvalidCredentialsError extends ApplicationError {
  statusCode = 401;
  constructor() {
    super('Invalid email or password.');
  }
}
