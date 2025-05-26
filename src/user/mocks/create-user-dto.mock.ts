import { CreateUserDto } from '../dto/create-user.dto';

export function createUserDtoMock(): CreateUserDto {
  return {
    name: 'John Doe',
    username: 'johndoe',
    password: 'password',
    email: 'jonh@example.com',
    bio: 'bio',
  };
}
