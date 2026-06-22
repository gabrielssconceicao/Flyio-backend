import { UnauthorizedError } from '@/core/errors/unauthorized-error';

import { IDENTITY_ERROR_IDENTIFIER } from '../../enterprise/constans/error-identifier';

export class InvalidRefreshTokenError extends UnauthorizedError {
  readonly identifier = IDENTITY_ERROR_IDENTIFIER.INVALID_REFRESH_TOKEN;

  constructor() {
    super('Invalid refresh token');
  }
}
