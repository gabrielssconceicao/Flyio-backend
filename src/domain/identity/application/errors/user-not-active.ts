import { UnauthorizedError } from '@/core/errors/unauthorized-error';

import { IDENTITY_ERROR_IDENTIFIER } from '../../enterprise/constans/error-identifier';

export class UserNotActiveError extends UnauthorizedError {
  readonly identifier = IDENTITY_ERROR_IDENTIFIER.USER_NOT_ACTIVE;
  constructor() {
    super('User account is inactive');
  }
}
