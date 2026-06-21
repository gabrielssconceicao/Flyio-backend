import { HashComparer } from '@/domain/identity/application/cryptography/comparer';
import { HashGenerator } from '@/domain/identity/application/cryptography/hasher';

export class TestHasher implements HashGenerator, HashComparer {
  async hash(password: string): Promise<string> {
    return Promise.resolve(`hashed-${password}`);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return Promise.resolve(hashedPassword === `hashed-${password}`);
  }
}
