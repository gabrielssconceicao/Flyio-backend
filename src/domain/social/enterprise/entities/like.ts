import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface LikeProps {
  user_id: UniqueEntityId;
  post_id: UniqueEntityId;
}

export class Like extends Entity<LikeProps> {
  get user_id() {
    return this.props.user_id;
  }

  get post_id() {
    return this.props.post_id;
  }

  static create(props: LikeProps) {
    const like = new Like(props);

    return like;
  }
}
