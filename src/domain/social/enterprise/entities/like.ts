import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface LikeProps {
  post_id: UniqueEntityId;
  user_id: UniqueEntityId;
  created_at?: Date;
}

export class Like extends Entity<LikeProps> {
  get post_id() {
    return this.props.post_id;
  }

  get user_id() {
    return this.props.user_id;
  }

  get created_at() {
    return this.props.created_at;
  }

  static create(props: Optional<LikeProps, 'created_at'>, id?: UniqueEntityId) {
    const like = new Like(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id,
    );
    return like;
  }
}
