import { Hasher } from '@/domain/social/application/cryptography/hasher';

export class TestHasher implements Hasher {
  async hash(value: string): Promise<string> {
    return `${value}-hashed`;
  }
}
