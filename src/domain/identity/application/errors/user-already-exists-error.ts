import { ConflictError } from '@/core/errors/conflict-error';

import { IDENTITY_ERROR_IDENTIFIER } from '../../enterprise/constans/error-identifier';

export class UserAlreadyExistsError extends ConflictError {
  readonly identifier = IDENTITY_ERROR_IDENTIFIER.USER_ALREADY_EXISTS;

  constructor() {
    super('A user with the provided information already exists');
  }
}
