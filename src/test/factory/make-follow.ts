import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Follow,
  FollowProps,
} from '@/domain/social/enterprise/entities/follow';

export function makeFollow(overrides: Partial<FollowProps> = {}) {
  const follow = Follow.create({
    follower_id: new UniqueEntityId(),
    following_id: new UniqueEntityId(),
    created_at: new Date(),
    ...overrides,
  });

  return follow;
}
