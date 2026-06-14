import { AppError } from './app-error';
import { ErrorCode } from './error-code';

export class ForbiddenError extends AppError {
  readonly code = ErrorCode.FORBIDDEN;

  readonly statusCode = 403;

  constructor(message = 'Forbidden') {
    super(message);
  }
}
