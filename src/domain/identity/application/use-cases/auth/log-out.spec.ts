import { makeRefreshToken } from '@/test/domain/factories/make-refresh-token';
import { InRefreshTokensRepository } from '@/test/domain/repositories/in-memory-refresh-tokens-repository';

import { LogoutUseCase } from './log-out';

let sut: LogoutUseCase;
let tokensRepository: InRefreshTokensRepository;

describe('Logout Use Case', () => {
  beforeEach(() => {
    tokensRepository = new InRefreshTokensRepository();
    sut = new LogoutUseCase(tokensRepository);
  });

  it('should be able to log out', async () => {
    const refreshToken = 'any_token';
    await tokensRepository.create(makeRefreshToken({ token: refreshToken }));

    const response = await sut.handle({ refreshToken });

    expect(response.isRight()).toBe(true);
    expect(response.value).toBeUndefined();
    expect(tokensRepository.items).toHaveLength(0);
  });
});
