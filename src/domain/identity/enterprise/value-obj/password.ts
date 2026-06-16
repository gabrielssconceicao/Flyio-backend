import { isStrongPassword } from 'validator';

import { Either, left, right } from '@/core/either/either';
import { ValueObject } from '@/core/value-objects/value-obj';

import { PASSWORD_OPTIONS } from '../constans/password-options';
import { InvalidPasswordError } from '../errors/invalid-password-error';

export class Password extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): Either<InvalidPasswordError, Password> {
    const normalizedValue = value.trim();

    if (
      /\s/.test(normalizedValue) ||
      !isStrongPassword(normalizedValue, {
        minLength: PASSWORD_OPTIONS.minLength,
        minUppercase: PASSWORD_OPTIONS.minUppercase,
        minNumbers: PASSWORD_OPTIONS.minNumbers,
        minSymbols: PASSWORD_OPTIONS.minSymbols,
      })
    ) {
      return left(new InvalidPasswordError(normalizedValue));
    }

    if (normalizedValue.length > PASSWORD_OPTIONS.maxLength) {
      return left(new InvalidPasswordError(normalizedValue));
    }

    return right(new Password(normalizedValue));
  }
}
