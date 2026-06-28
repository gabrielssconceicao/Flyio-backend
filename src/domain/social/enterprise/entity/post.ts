import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export type PostProps = {
  content: string;
  authorId: UniqueEntityId;

  likesCount: number;
  commentsCount: number;

  createdAt: Date;
  deletedAt: Date | null;
  updatedAt?: Date;
};

export class Post extends AggregateRoot<PostProps> {
  static create(
    props: Optional<PostProps, 'likesCount' | 'commentsCount' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
    id?: UniqueEntityId,
  ) {
    return new Post(
      {
        ...props,
        likesCount: props.likesCount ?? 0,
        commentsCount: props.commentsCount ?? 0,
        createdAt: props.createdAt ?? new Date(),
        deletedAt: props.deletedAt ?? null,
      },
      id,
    );
  }

  get authorId() {
    return this.props.authorId;
  }

  get content() {
    return this.props.content;
  }

  get likesCount() {
    return this.props.likesCount;
  }

  get commentsCount() {
    return this.props.commentsCount;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  increaseLikes() {
    this.props.likesCount += 1;
    this.touch();
  }

  decreaseLikes() {
    if (this.props.likesCount > 0) {
      this.props.likesCount -= 1;
      this.touch();
    }
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
