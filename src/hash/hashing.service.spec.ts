import * as bcrypt from 'bcryptjs';
import { HashingService } from './hashing.service';
jest.mock('bcryptjs');

describe('HashingService', () => {
  let hashingService: HashingService;

  beforeEach(() => {
    hashingService = new HashingService();
  });

  it('should generate a hashed passsword', async () => {
    const password = 'password';
    const hashedPassword = 'hashedPassword';
    const salt = 10;

    (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    const result = await hashingService.hash(password);
    expect(bcrypt.genSalt).toHaveBeenCalledWith(salt);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
    expect(result).toBe(hashedPassword);
  });

  it('should compare a password with a hash and return true', async () => {
    const password = 'password';
    const hash = 'hashedPassword';
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const result = await hashingService.compare({ password, hash });
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
    expect(result).toBe(true);
  });

  it('should compare a password with a hash and return false', async () => {
    const password = 'failedPassword';
    const hash = 'hashedPassword';
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const result = await hashingService.compare({ password, hash });
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
    expect(result).toBe(false);
  });
});
