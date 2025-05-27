import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthService } from '../auth.service';
import { HashingService } from '@/hash/hashing.service';
import jwtConfig from '../jwt.config';
import { UserLoginDto } from '../dto/user-login.dto';
import { UnauthorizedException } from '@nestjs/common';

const jwtConfigMock = {
  secret: 'secret',
  audience: 'audience',
  issuer: 'issuer',
  accessTokenExpiresIn: 3600,
  refreshTokenExpiresIn: 14400,
};
describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let hashing: HashingService;
  let jwt: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: HashingService,
          useValue: {
            compare: jest.fn(),
          },
        },
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

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    hashing = module.get<HashingService>(HashingService);
    jwt = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
    expect(hashing).toBeDefined();
    expect(jwt).toBeDefined();
  });

  describe('SignIn', () => {
    let userLoginDto: UserLoginDto;

    beforeEach(() => {
      userLoginDto = {
        login: 'johndoe',
        password: 'password',
      };
    });

    it('should generate access token', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
        id: '1',
        username: 'johndoe',
        password: 'hashedPassword',
      } as any);
      jest.spyOn(hashing, 'compare').mockResolvedValue(true);
      jest
        .spyOn(jwt, 'signAsync')
        .mockResolvedValueOnce('accessToken')
        .mockResolvedValueOnce('refreshToken');

      const result = await service.signIn(userLoginDto);

      expect(prisma.user.findFirst).toHaveBeenCalled();

      expect(hashing.compare).toHaveBeenCalledWith({
        password: userLoginDto.password,
        hash: 'hashedPassword',
      });

      expect(jwt.signAsync).toHaveBeenCalledWith(
        { id: '1', username: 'johndoe' },
        {
          secret: jwtConfigMock.secret,
          audience: jwtConfigMock.audience,
          issuer: jwtConfigMock.issuer,
          expiresIn: jwtConfigMock.accessTokenExpiresIn,
        },
      );
      expect(jwt.signAsync).toHaveBeenCalledWith(
        { id: '1', username: 'johndoe' },
        {
          secret: jwtConfigMock.secret,
          audience: jwtConfigMock.audience,
          issuer: jwtConfigMock.issuer,
          expiresIn: jwtConfigMock.refreshTokenExpiresIn,
        },
      );

      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      expect(result).toMatchSnapshot();
    });

    it('should throw an unauthorized exception if login credentials are invalid', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);

      await expect(service.signIn(userLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(prisma.user.findFirst).toHaveBeenCalled();
    });

    it('should throw an unauthorized exception if password credentials are invalid', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
        id: '1',
        username: 'johndoe',
        password: 'hashedPassword',
      } as any);
      jest.spyOn(hashing, 'compare').mockResolvedValue(false);

      await expect(service.signIn(userLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(prisma.user.findFirst).toHaveBeenCalled();
      expect(hashing.compare).toHaveBeenCalledWith({
        password: userLoginDto.password,
        hash: 'hashedPassword',
      });
    });
  });

  describe('Refresh', () => {
    it('should refresh a token', async () => {
      jest.spyOn(jwt, 'verify').mockReturnValue({
        id: '1',
        username: 'johndoe',
      });

      jest
        .spyOn(jwt, 'signAsync')
        .mockResolvedValueOnce('newAccessToken')
        .mockResolvedValueOnce('newRefreshToken');

      const result = await service.refresh('token');

      expect(jwt.verify).toHaveBeenCalledWith('token', jwtConfigMock);

      expect(jwt.signAsync).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        newAccessToken: 'newAccessToken',
      });
    });

    it('should thow an UnauthorizedException if token is missing', async () => {
      await expect(service.refresh('')).rejects.toThrow(UnauthorizedException);
    });

    it('should thow an UnauthorizedException if token is invalid', async () => {
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error();
      });
      await expect(service.refresh('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
