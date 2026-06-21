import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { RefreshToken, RefreshTokenProps } from '@/domain/identity/enterprise/entities/refresh-token';

export function makeRefreshToken(override: Partial<RefreshTokenProps> = {}, id?: UniqueEntityId): RefreshToken {
  return RefreshToken.create(
    {
      createdAt: new Date(),
      expiresAt: new Date(),
      userId: new UniqueEntityId(),
      token: faker.string.uuid(),
      ...override,
    },
    id,
  );
}
