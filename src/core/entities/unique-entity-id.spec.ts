import { UniqueEntityId } from './unique-entity-id';

describe('UniqueEntityId', () => {
  it('should create an id automatically', () => {
    const id = new UniqueEntityId();

    expect(id).toBeTruthy();
  });

  it('should accept an existing id ', () => {
    const id = UniqueEntityId.createFromText('12345678-1234-1234-1234-123456789012');

    expect(id.value).toBe('12345678-1234-1234-1234-123456789012');
  });

  it('should return true when ids are equal', () => {
    const id1 = UniqueEntityId.createFromText('12345678-1234-1234-1234-123456789012');

    const id2 = UniqueEntityId.createFromText('12345678-1234-1234-1234-123456789012');

    expect(id1.equals(id2)).toBe(true);
  });

  it('should return false when ids are different', () => {
    const id1 = UniqueEntityId.createFromText('11111111-1111-1111-1111-111111111111');

    const id2 = UniqueEntityId.createFromText('22222222-2222-2222-2222-222222222222');

    expect(id1.equals(id2)).toBe(false);
  });

  it('should return false when other id is undefined', () => {
    const id = new UniqueEntityId();

    expect(id.equals(undefined)).toBe(false);
  });
});
