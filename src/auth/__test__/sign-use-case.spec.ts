import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from '@/hash/hashing.service';
import { PrismaService } from '@/prisma/prisma.service';
import jwtConfig from '../jwt.config';
import { UserLoginDto } from '../dto/user-login.dto';
import { SignInUseCase } from '../use-cases';
import { jwtConfigMock } from '../mock/jwt-config.mock';
describe('SignInUseCase', () => {
  let useCase: SignInUseCase;
  let prisma: PrismaService;
  let hashing: HashingService;
  let jwt: JwtService;
  let userLoginDto: UserLoginDto;
  let hashedPassword: string;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInUseCase,
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

    useCase = module.get<SignInUseCase>(SignInUseCase);
    prisma = module.get<PrismaService>(PrismaService);
    hashing = module.get<HashingService>(HashingService);
    jwt = module.get<JwtService>(JwtService);
    userLoginDto = {
      login: 'johndoe',
      password: 'password',
    };
    hashedPassword = 'hashedPassword';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(prisma).toBeDefined();
    expect(hashing).toBeDefined();
    expect(jwt).toBeDefined();
  });

  describe('Execute', () => {
    it('should generate access token', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
        id: '1',
        username: 'johndoe',
        password: hashedPassword,
      } as any);
      jest.spyOn(hashing, 'compare').mockResolvedValue(true);
      jest
        .spyOn(jwt, 'signAsync')
        .mockResolvedValueOnce('accessToken')
        .mockResolvedValueOnce('refreshToken');

      const result = await useCase.execute(userLoginDto);

      expect(prisma.user.findFirst).toHaveBeenCalled();

      expect(hashing.compare).toHaveBeenCalledWith({
        password: userLoginDto.password,
        hash: hashedPassword,
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

      await expect(useCase.execute(userLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(prisma.user.findFirst).toHaveBeenCalled();
    });

    it('should throw an unauthorized exception if password credentials are invalid', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
        id: '1',
        username: 'johndoe',
        password: hashedPassword,
      } as any);
      jest.spyOn(hashing, 'compare').mockResolvedValue(false);

      await expect(useCase.execute(userLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(prisma.user.findFirst).toHaveBeenCalled();
      expect(hashing.compare).toHaveBeenCalledWith({
        password: userLoginDto.password,
        hash: hashedPassword,
      });
    });
  });
});
