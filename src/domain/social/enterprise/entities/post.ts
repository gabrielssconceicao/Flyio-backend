import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface PostProps {
  author_id: UniqueEntityId;
  content: string;
  created_at: Date;
  updated_at?: Date;
}

export class Post extends Entity<PostProps> {
  get author_id() {
    return this.props.author_id;
  }

  get content() {
    return this.props.content;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }
  static create(props: Optional<PostProps, 'created_at'>, id?: UniqueEntityId) {
    return new Post(
      { ...props, created_at: props.created_at ?? new Date() },
      id,
    );
  }
}
