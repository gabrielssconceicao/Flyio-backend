import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from '../cookie.constant';
import { UserLoginDto } from '../dto/user-login.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: { signIn: jest.fn(), refresh: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('SignIn', () => {
    it('should sign in a user and set a cookie', async () => {
      const userLoginDto: UserLoginDto = {
        login: 'johndoe',
        password: 'password',
      };
      const mockCookie = jest.fn();
      const res = { cookie: mockCookie } as unknown as Response;

      jest.spyOn(service, 'signIn').mockResolvedValue({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      const result = await controller.signIn(userLoginDto, res);

      expect(mockCookie).toHaveBeenCalledTimes(2);
      expect(mockCookie).toHaveBeenCalledWith(
        COOKIE_ACCESS_TOKEN,
        'accessToken',
        {
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          maxAge: expect.any(Number),
        },
      );
      expect(mockCookie).toHaveBeenCalledWith(
        COOKIE_REFRESH_TOKEN,
        'refreshToken',
        {
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          maxAge: expect.any(Number),
        },
      );
      expect(service.signIn).toHaveBeenCalledWith(userLoginDto);
      expect(result).toMatchSnapshot();
    });

    it('should throw an UnauthorizedException if login credentials are invalid', async () => {
      const userLoginDto: UserLoginDto = {
        login: 'johndoe',
        password: 'wrong_password',
      };

      jest
        .spyOn(service, 'signIn')
        .mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(
        controller.signIn(userLoginDto, {} as Response),
      ).rejects.toThrow(UnauthorizedException);
      expect(service.signIn).toHaveBeenCalledWith(userLoginDto);
    });
  });

  describe('Refresh', () => {
    it('should refresh a token', async () => {
      jest
        .spyOn(service, 'refresh')
        .mockResolvedValue({ newAccessToken: 'newAccessToken' });
      const mockCookie = jest.fn();
      const res = { cookie: mockCookie } as unknown as Response;
      await controller.refresh(
        { cookies: { [COOKIE_REFRESH_TOKEN]: 'token' } } as any,
        res,
      );

      expect(service.refresh).toHaveBeenCalledWith('token');
      expect(mockCookie).toHaveBeenCalledWith(
        COOKIE_ACCESS_TOKEN,
        'newAccessToken',
        {
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          maxAge: expect.any(Number),
        },
      );
    });

    it('should throw an UnauthorizedException if token is invalid or missing', async () => {
      jest
        .spyOn(service, 'refresh')
        .mockRejectedValue(
          new UnauthorizedException('Invalid or missing token'),
        );

      await expect(
        controller.refresh(
          {
            cookies: { [COOKIE_REFRESH_TOKEN]: 'invalid_token' },
          } as any,
          {} as Response,
        ),
      ).rejects.toThrow(UnauthorizedException);
      expect(service.refresh).toHaveBeenCalledWith('invalid_token');
    });
  });
});
