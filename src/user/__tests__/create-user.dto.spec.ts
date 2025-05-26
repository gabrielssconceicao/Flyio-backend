import { validate } from 'class-validator';
import { CreateUserDto } from '../dto/create-user.dto';
import { formatDtoErrors } from '@/common/utils/dto-format-error';
describe('<CreateUserDto>', () => {
  it('should validate', async () => {
    const dto = new CreateUserDto();
    dto.name = 'Jonh Doe';
    dto.username = 'johndoe';
    dto.email = 'jonh@example.com';
    dto.password = 'password';
    dto.bio = 'I am a bio';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if data is out of range', async () => {
    const dto = new CreateUserDto();
    dto.name = 'J';
    dto.username = '';
    dto.email = 'invalid';
    dto.password = '123';
    dto.bio = 'a'.repeat(201);
    const errors = await validate(dto);
    expect(errors.length).toBe(5);
    const result = formatDtoErrors(errors);

    expect(result).toMatchSnapshot();
  });
});
