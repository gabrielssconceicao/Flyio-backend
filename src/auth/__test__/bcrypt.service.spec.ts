import * as bcrypt from 'bcryptjs';
import { BcryptService } from '../bcrypt.service';
jest.mock('bcryptjs');

describe('BcryptService', () => {
  let bcryptService: BcryptService;

  beforeEach(() => {
    bcryptService = new BcryptService();
  });

  it('should generate a hashed passsword', async () => {
    const password = 'password';
    const hashedPassword = 'hashedPassword';
    const salt = 10;

    (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    const result = await bcryptService.hash(password);
    expect(bcrypt.genSalt).toHaveBeenCalledWith(salt);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
    expect(result).toBe(hashedPassword);
  });
});
