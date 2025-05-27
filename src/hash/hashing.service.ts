import { Injectable } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcryptjs';

@Injectable()
export class HashingService {
  async hash(password: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  async compare({
    password,
    hash,
  }: {
    password: string;
    hash: string;
  }): Promise<boolean> {
    return compare(password, hash);
  }
}
