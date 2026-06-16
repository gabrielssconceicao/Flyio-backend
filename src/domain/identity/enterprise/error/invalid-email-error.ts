import { ValidationError } from '@/core/errors/validation-error';

import { USER_ERROR_IDENTIFIER } from '../constans/error-identifier';

export class InvalidEmailError extends ValidationError {
  readonly identifier = USER_ERROR_IDENTIFIER.INVALID_EMAIL;

  constructor(msg: string) {
    super(`${msg} is not a valid email`);
  }
}
