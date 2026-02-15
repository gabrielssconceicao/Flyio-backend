import { ValueObject } from '@/core/entities/value-object';

import { InvalidEmailError } from './errors/invalid-email-error';

export interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  get value(): string {
    return this.props.value;
  }

  private static isValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  public static create(raw: string): Email {
    if (!raw || typeof raw !== 'string') {
      throw new InvalidEmailError();
    }

    const normalized = raw.trim();

    if (!this.isValid(normalized)) {
      throw new InvalidEmailError();
    }

    return new Email({ value: normalized });
  }
}
