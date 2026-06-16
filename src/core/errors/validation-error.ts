import { AppError } from './app-error';
import { ErrorCode } from './error-code';

export abstract class ValidationError extends AppError {
  readonly code = ErrorCode.VALIDATION_ERROR;
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
  }
}
