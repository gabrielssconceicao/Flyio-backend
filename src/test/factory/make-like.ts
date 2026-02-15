import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Like, LikeProps } from '@/domain/social/enterprise/entities/like';

export function makeLike(overrides: Partial<LikeProps> = {}) {
  const like = Like.create({
    user_id: new UniqueEntityId(),
    post_id: new UniqueEntityId(),
    created_at: new Date(),
    ...overrides,
  });

  return like;
}
