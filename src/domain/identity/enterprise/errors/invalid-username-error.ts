import { ValidationError } from '@/core/errors/validation-error';

import { IDENTITY_ERROR_IDENTIFIER } from '../constans/error-identifier';

export class InvalidUsernameError extends ValidationError {
  readonly identifier = IDENTITY_ERROR_IDENTIFIER.INVALID_USERNAME;

  constructor(msg: string) {
    super(`${msg} is not a valid username`);
  }
}
