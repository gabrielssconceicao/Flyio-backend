import { HashComparer } from '@/domain/identity/application/cryptography/comparer';

export class TestComparer implements HashComparer {
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return Promise.resolve(hashedPassword === `hashed-${password}`);
  }
}
