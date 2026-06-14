import { AppError } from './app-error';
import { ErrorCode } from './error-code';

export class ConflictError extends AppError {
  readonly code = ErrorCode.CONFLICT;

  readonly statusCode = 409;

  constructor(message = 'Conflict') {
    super(message);
  }
}
