import { UniqueEntityId } from './unique-entity-id';

describe('UniqueEntityId', () => {
  it('should generate an ID', () => {
    const id = new UniqueEntityId();
    expect(id.toString()).toEqual(expect.any(String));
  });

  it('should accept a string as ID', () => {
    const id = new UniqueEntityId('123');
    expect(id.toString()).toEqual('123');
  });
});
