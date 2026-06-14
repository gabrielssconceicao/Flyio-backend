import { AppError } from './app-error';
import { ErrorCode } from './error-code';

export class UnauthorizedError extends AppError {
  readonly code = ErrorCode.UNAUTHORIZED;

  readonly statusCode = 401;

  constructor(message = 'Unauthorized') {
    super(message);
  }
}
