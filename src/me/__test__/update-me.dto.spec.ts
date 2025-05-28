import { validate } from 'class-validator';
import { UpdateMeDto } from '../dto/update-me.dto';
import { formatDtoErrors } from '@/common/utils/dto-format-error';

describe('UpdateMeDto', () => {
  let dto: UpdateMeDto;

  it('should validate', async () => {
    dto = new UpdateMeDto();
    dto.name = 'John Doe';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if data is out of range', async () => {
    dto = new UpdateMeDto();
    dto.name = 'J';
    dto.password = '1'.repeat(51);
    const errors = await validate(dto);
    expect(errors.length).toBe(2);
    expect(formatDtoErrors(errors)).toMatchSnapshot();
  });
});
