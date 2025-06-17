import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { RefreshTokenUseCase, SignInUseCase } from '../use-cases';

describe('AuthService', () => {
  let service: AuthService;
  let signInUseCase: SignInUseCase;
  let refreshTokenUseCase: RefreshTokenUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: SignInUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: RefreshTokenUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    signInUseCase = module.get<SignInUseCase>(SignInUseCase);
    refreshTokenUseCase = module.get<RefreshTokenUseCase>(RefreshTokenUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(signInUseCase).toBeDefined();
    expect(refreshTokenUseCase).toBeDefined();
  });

  it('should generate access token', async () => {
    const signInDto = {
      login: 'johndoe',
      password: 'password',
    };
    jest.spyOn(signInUseCase, 'execute').mockResolvedValue({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    });
    const result = await service.signIn(signInDto);
    expect(result).toBeDefined();
    expect(signInUseCase.execute).toHaveBeenCalledWith(signInDto);
    expect(result).toMatchSnapshot();
  });

  it('should generate a new access token', async () => {
    jest.spyOn(refreshTokenUseCase, 'execute').mockResolvedValue({
      newAccessToken: 'newAccessToken',
    });
    const result = await service.refresh('token');
    expect(result).toBeDefined();
    expect(refreshTokenUseCase.execute).toHaveBeenCalledWith('token');
    expect(result).toMatchSnapshot();
  });
});
