export abstract class ValueObject<T> {
  private readonly _value: T;

  get value(): T {
    return this._value;
  }

  toString(): string {
    return String(this.value);
  }

  protected constructor(value: T) {
    this._value = value;
  }

  equals(vo: ValueObject<T>): boolean {
    return JSON.stringify(this.value) === JSON.stringify(vo.value);
  }
}
