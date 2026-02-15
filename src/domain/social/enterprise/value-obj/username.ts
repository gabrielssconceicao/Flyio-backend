import { ValueObject } from '@/core/entities/value-object';

import { InvalidUsernameError } from './errors/invalid-username-error';

export interface UsernameProps {
  value: string;
}

export class Username extends ValueObject<UsernameProps> {
  get value(): string {
    return this.props.value;
  }

  private static isValid(username: string): boolean {
    const regex = /^[a-zA-Z0-9_]+$/;
    return regex.test(username);
  }

  public static create(raw: string): Username {
    if (!raw || typeof raw !== 'string') {
      throw new InvalidUsernameError();
    }

    const normalized = raw.trim();

    if (!this.isValid(normalized)) {
      throw new InvalidUsernameError();
    }

    return new Username({ value: normalized });
  }
}
