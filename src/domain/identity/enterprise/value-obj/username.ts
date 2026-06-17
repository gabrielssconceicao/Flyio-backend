import { Either, left, right } from '@/core/either/either';
import { ValueObject } from '@/core/value-objects/value-obj';

import { InvalidUsernameError } from '../errors/invalid-username-error';

export class Username extends ValueObject<string> {
  private constructor(username: string) {
    super(username);
  }

  static create(username: string): Either<InvalidUsernameError, Username> {
    const normalizedUsername = username.trim();

    if (normalizedUsername.length < 3 || normalizedUsername.length > 30) {
      return left(new InvalidUsernameError(normalizedUsername));
    }

    const usernameRegex = /^[a-zA-Z0-9_.]+$/;

    if (!usernameRegex.test(username)) {
      return left(new InvalidUsernameError(normalizedUsername));
    }

    return right(new Username(normalizedUsername));
  }
}
