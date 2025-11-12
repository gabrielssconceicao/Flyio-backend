import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Like, LikeProps } from '@/domain/social/enterprise/entities/like';

export function makeLike(
  override: Partial<LikeProps> = {},
  id?: UniqueEntityId,
) {
  const newLike = Like.create(
    {
      post_id: new UniqueEntityId(),
      user_id: new UniqueEntityId(),
      ...override,
    },
    id,
  );

  return newLike;
}
