import { NotFoundError } from '@/core/errors/not-found-error';

import { IDENTITY_ERROR_IDENTIFIER } from '../../enterprise/constans/error-identifier';

export class UserNotFoundError extends NotFoundError {
  readonly identifier = IDENTITY_ERROR_IDENTIFIER.USER_NOT_FOUND;

  constructor() {
    super('User was not found');
  }
}
