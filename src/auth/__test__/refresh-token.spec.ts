import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { HashingService } from '@/hash/hashing.service';
import { RefreshTokenUseCase } from '../use-cases';
import jwtConfig from '../jwt.config';
import { jwtConfigMock } from '../mock/jwt-config.mock';

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;
  let hashing: HashingService;
  let jwt: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenUseCase,
        PrismaService,
        HashingService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: jwtConfig.KEY,
          useValue: jwtConfigMock,
        },
      ],
    }).compile();

    useCase = module.get<RefreshTokenUseCase>(RefreshTokenUseCase);
    hashing = module.get<HashingService>(HashingService);
    jwt = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(hashing).toBeDefined();
    expect(jwt).toBeDefined();
  });

  describe('Execute', () => {
    it('should refresh a token', async () => {
      jest.spyOn(jwt, 'verify').mockReturnValue({
        id: '1',
        username: 'johndoe',
      });

      jest
        .spyOn(jwt, 'signAsync')
        .mockResolvedValueOnce('newAccessToken')
        .mockResolvedValueOnce('newRefreshToken');

      const result = await useCase.execute('token');

      expect(jwt.verify).toHaveBeenCalledWith('token', jwtConfigMock);

      expect(jwt.signAsync).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        newAccessToken: 'newAccessToken',
      });

      expect(result).toMatchSnapshot();
    });

    it('should thow an UnauthorizedException if token is missing', async () => {
      await expect(useCase.execute('')).rejects.toThrow(UnauthorizedException);
    });

    it('should thow an UnauthorizedException if token is invalid', async () => {
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error();
      });
      await expect(useCase.execute('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
