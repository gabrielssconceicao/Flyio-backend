import { ApplicationError } from './application-error';

export class ForbiddenError extends ApplicationError {
  statusCode = 403;
  constructor(message = 'Forbidden') {
    super(message);
  }
}
