import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface TagProps {
  name: string;
}

export class Tag extends Entity<TagProps> {
  get name() {
    return this.props.name;
  }

  static create(props: TagProps, id?: UniqueEntityId) {
    const tag = new Tag(props, id);
    return tag;
  }
}
