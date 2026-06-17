import { HashGenerator } from '@/domain/identity/application/cryptography/hasher';

export class TestHasher implements HashGenerator {
  async hash(password: string): Promise<string> {
    return Promise.resolve(`hashed-${password}`);
  }
}
