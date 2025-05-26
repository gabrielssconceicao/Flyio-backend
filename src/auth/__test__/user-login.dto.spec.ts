import { validate } from 'class-validator';
import { UserLoginDto } from '../dto/user-login.dto';
import { formatDtoErrors } from '@/common/utils/dto-format-error';

describe('<UserLoginDto>', () => {
  it('should validade', async () => {
    const dto = new UserLoginDto();
    dto.login = 'johndoe';
    dto.password = 'password';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if data is out of range', async () => {
    const dto = new UserLoginDto();
    dto.login = '';
    dto.password = '';
    const errors = await validate(dto);
    expect(errors.length).toBe(2);
    expect(formatDtoErrors(errors)).toMatchSnapshot();
  });
});
