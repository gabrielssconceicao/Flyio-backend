import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

import { PostTag } from './post-tag';

export interface PostProps {
  author_id: UniqueEntityId;
  content: string;
  tags: PostTag[];
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

  get tags() {
    return this.props.tags;
  }

  set tags(tags: PostTag[]) {
    this.props.tags = tags;
  }

  private touch() {
    this.props.updated_at = new Date();
  }

  static create(
    props: Optional<PostProps, 'tags' | 'created_at'>,
    id?: UniqueEntityId,
  ) {
    const post = new Post(
      {
        ...props,
        tags: props.tags ?? [],
        created_at: props.created_at ?? new Date(),
      },
      id,
    );
    return post;
  }
}
