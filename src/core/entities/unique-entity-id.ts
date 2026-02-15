import { randomUUID } from 'node:crypto';
export class UniqueEntityId {
  private _value: string;

  get value() {
    return this._value;
  }

  equals(id: UniqueEntityId | string): boolean {
    if (id instanceof UniqueEntityId) {
      return this.value === id.value;
    }
    return this.value === id;
  }

  constructor(value?: string) {
    this._value = value ?? randomUUID();
  }
}
