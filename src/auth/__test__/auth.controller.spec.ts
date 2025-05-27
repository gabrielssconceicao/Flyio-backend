import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { COOKIE_ACCESS_TOKEN } from '../cookie.contant';
import { UserLoginDto } from '../dto/user-login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: { signIn: jest.fn() } }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
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
      });

      const result = await controller.signIn(userLoginDto, res);

      expect(mockCookie).toHaveBeenCalledWith(
        COOKIE_ACCESS_TOKEN,
        'accessToken',
        {
          httpOnly: true,
          sameSite: 'lax',
          secure: true,
          maxAge: expect.any(Number),
        },
      );
      expect(service.signIn).toHaveBeenCalledWith(userLoginDto);
      expect(result).toMatchSnapshot();
    });
  });
});
