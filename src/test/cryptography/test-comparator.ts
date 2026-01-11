import { Comparator } from '@/domain/social/application/cryptography/comparator';

export class TestComparator extends Comparator {
  compare(data: { password: string; hash: string }): Promise<boolean> {
    const isValid = data.hash === `hashed-${data.password}`;
    return Promise.resolve(isValid);
  }
}
