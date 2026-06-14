// entity.spec.ts

import { Entity } from './entity';
import { UniqueEntityId } from './unique-entity-id';

type TestEntityProps = {
  name: string;
};

class TestEntity extends Entity<TestEntityProps> {
  static create(props: TestEntityProps, id?: UniqueEntityId) {
    return new TestEntity(props, id);
  }
}

describe('Entity', () => {
  it('should compare entities with same id', () => {
    const id = new UniqueEntityId();

    const entity1 = TestEntity.create({ name: 'Gabriel' }, id);

    const entity2 = TestEntity.create({ name: 'João' }, id);

    expect(entity1.equals(entity2)).toBe(true);
  });

  it('should compare entities with different ids', () => {
    const entity1 = TestEntity.create({
      name: 'Gabriel',
    });

    const entity2 = TestEntity.create({
      name: 'João',
    });

    expect(entity1.equals(entity2)).toBe(false);
  });
});
