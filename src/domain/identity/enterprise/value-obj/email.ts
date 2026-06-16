import { isEmail } from 'validator';

import { Either, left, right } from '@/core/either/either';
import { ValueObject } from '@/core/value-objects/value-obj';

import { InvalidEmailError } from '../error/invalid-email-error';

export class Email extends ValueObject<string> {
  private constructor(email: string) {
    super(email);
  }

  static create(email: string): Either<InvalidEmailError, Email> {
    const normalizedEmail = email.trim();

    if (!isEmail(normalizedEmail)) {
      return left(new InvalidEmailError(normalizedEmail));
    }

    return right(new Email(normalizedEmail));
  }
}
