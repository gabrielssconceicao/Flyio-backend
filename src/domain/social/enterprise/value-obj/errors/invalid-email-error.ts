import { ApplicationError } from '@/core/errors/application-error';

export class InvalidEmailError extends ApplicationError {
  statusCode = 400;
  constructor() {
    super('Invalid email');
  }
}
