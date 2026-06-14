import { AppError } from './app-error';
import { ErrorCode } from './error-code';

export class NotFoundError extends AppError {
  readonly code = ErrorCode.NOT_FOUND;

  readonly statusCode = 404;

  constructor(message = 'Resource not found') {
    super(message);
  }
}
