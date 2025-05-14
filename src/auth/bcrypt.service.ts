import { Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class BcryptService {
  async hash(password: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(password, salt);
  }
}
