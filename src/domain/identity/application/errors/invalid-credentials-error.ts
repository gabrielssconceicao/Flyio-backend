import { UnauthorizedError } from '@/core/errors/unauthorized-error';

import { IDENTITY_ERROR_IDENTIFIER } from '../../enterprise/constans/error-identifier';

export class InvalidCredentialsError extends UnauthorizedError {
  readonly identifier = IDENTITY_ERROR_IDENTIFIER.INVALID_CREDENTIALS;
  constructor() {
    super('Invalid credentials');
  }
}
