import { ValidationError } from '@/core/errors/validation-error';

import { IDENTITY_ERROR_IDENTIFIER } from '../constans/error-identifier';

export class InvalidEmailError extends ValidationError {
  readonly identifier = IDENTITY_ERROR_IDENTIFIER.INVALID_EMAIL;

  constructor(msg: string) {
    super(`${msg} is not a valid email`);
  }
}
