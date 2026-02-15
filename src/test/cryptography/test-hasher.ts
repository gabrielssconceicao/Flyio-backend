import { Hasher } from '@/domain/social/application/cryptography/hasher';

export class TestHasher extends Hasher {
  hash(password: string): Promise<string> {
    return Promise.resolve(`hashed-${password}`);
  }
}
