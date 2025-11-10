import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface PostTagProps {
  postId: UniqueEntityId;
  tagId: UniqueEntityId;
}

export class PostTag extends Entity<PostTagProps> {
  get postId() {
    return this.props.postId;
  }

  get tagId() {
    return this.props.tagId;
  }

  static create(props: PostTagProps, id?: UniqueEntityId) {
    const postTag = new PostTag(props, id);
    return postTag;
  }
}
