import { randomUUID } from 'node:crypto';

export class UniqueEntityId {
  private readonly _value: string;

  constructor(value?: string) {
    this._value = value ?? randomUUID();
  }

  static createFromText(value?: string): UniqueEntityId {
    return new UniqueEntityId(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other?: UniqueEntityId): boolean {
    if (!other) {
      return false;
    }

    return this._value === other.value;
  }

  toValue(): string {
    return this._value;
  }
}
