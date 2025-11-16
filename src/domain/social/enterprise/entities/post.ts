import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

import { PostTag } from './post-tag';

export interface PostProps {
  author_id: UniqueEntityId;
  content: string | null;
  tags: PostTag[];
  likes: number;
  isDeleted: boolean;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
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

  get tags() {
    return this.props.tags;
  }

  get likes() {
    return this.props.likes;
  }

  get isDeleted() {
    return this.props.isDeleted;
  }

  set tags(tags: PostTag[]) {
    this.props.tags = tags;
  }

  addLike() {
    this.props.likes += 1;
    this.touch();
  }

  removeLike() {
    if (this.props.likes <= 0) return;
    this.props.likes -= 1;
    this.touch();
  }

  delete() {
    this.props.isDeleted = true;
    this.props.content = null;
    this.props.deleted_at = new Date();
    this.touch();
  }

  private touch() {
    this.props.updated_at = new Date();
  }

  static create(
    props: Optional<PostProps, 'tags' | 'created_at' | 'likes' | 'deleted_at'>,
    id?: UniqueEntityId,
  ) {
    const post = new Post(
      {
        ...props,
        tags: props.tags ?? [],
        likes: props.likes ?? 0,
        created_at: props.created_at ?? new Date(),
        deleted_at: props.deleted_at ?? null,
      },
      id,
    );
    return post;
  }
}
