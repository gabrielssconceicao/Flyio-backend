import { faker } from '@faker-js/faker';

import { UserDto } from '@/domain/identity/application/dto/user-dto';

export function makeUserDto(override: Partial<UserDto> = {}): UserDto {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    username: faker.internet.username().toLowerCase(),
    bio: faker.lorem.sentence(),
    isFollowing: faker.datatype.boolean(),
    ...override,
  };
}
