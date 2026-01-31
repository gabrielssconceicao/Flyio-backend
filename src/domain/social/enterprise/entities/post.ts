import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface PostProps {
  author_id: UniqueEntityId;
  content: string;
  created_at: Date;
  deleted_at: Date | null;
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

  get deleted_at() {
    return this.props.deleted_at;
  }

  delete() {
    this.props.deleted_at = new Date();
    this.touch();
  }

  private touch() {
    this.props.updated_at = new Date();
  }

  static create(
    props: Optional<PostProps, 'created_at' | 'deleted_at'>,
    id?: UniqueEntityId,
  ) {
    return new Post(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
        deleted_at: null,
      },
      id,
    );
  }
}
