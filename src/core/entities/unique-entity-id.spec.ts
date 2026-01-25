import { UniqueEntityId } from './unique-entity-id';

describe('UniqueEntityId', () => {
  it('should generate an ID', () => {
    const id = new UniqueEntityId();
    expect(id.value).toEqual(expect.any(String));
  });

  it('should accept a string as ID', () => {
    const id = new UniqueEntityId('123');
    expect(id.value).toEqual('123');
  });

  it('should compare ids', () => {
    const id1 = new UniqueEntityId('123');
    const id2 = new UniqueEntityId('123');
    expect(id1.equals(id2)).toBe(true);
    expect(id1.equals('123')).toBe(true);
    expect(id1.equals('124')).toBe(false);
  });
});
