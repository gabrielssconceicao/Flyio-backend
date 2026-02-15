import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface FollowProps {
  follower_id: UniqueEntityId;
  following_id: UniqueEntityId;
  created_at: Date;
}

export class Follow extends Entity<FollowProps> {
  get followerId() {
    return this.props.follower_id;
  }

  get followingId() {
    return this.props.following_id;
  }

  get createdAt() {
    return this.props.created_at;
  }

  static create(props: Optional<FollowProps, 'created_at'>) {
    const follow = new Follow({
      ...props,
      created_at: props.created_at ?? new Date(),
    });

    return follow;
  }
}
