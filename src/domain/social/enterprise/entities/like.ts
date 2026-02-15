import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface LikeProps {
  user_id: UniqueEntityId;
  post_id: UniqueEntityId;
  created_at: Date;
}

export class Like extends Entity<LikeProps> {
  get user_id() {
    return this.props.user_id;
  }

  get post_id() {
    return this.props.post_id;
  }

  static create(props: Optional<LikeProps, 'created_at'>) {
    const like = new Like({ ...props, created_at: new Date() });

    return like;
  }
}
