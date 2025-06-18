import { Test, TestingModule } from '@nestjs/testing';
import { FollowService } from '../follow.service';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { FollowUseCase, UnfollowUseCase } from '../use-cases';
describe('FollowService', () => {
  let service: FollowService;
  let follow: FollowUseCase;
  let unfollow: UnfollowUseCase;
  let payload: JwtPayload;
  let username: string;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowService,
        {
          provide: FollowUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UnfollowUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FollowService>(FollowService);

    follow = module.get<FollowUseCase>(FollowUseCase);
    unfollow = module.get<UnfollowUseCase>(UnfollowUseCase);
    payload = { id: 'id-1', username: 'johndoe2' } as JwtPayload;
    username = 'jonhdoe';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(follow).toBeDefined();
    expect(unfollow).toBeDefined();
  });

  it('should follow', async () => {
    await service.follow({ username, payload });
    expect(follow.execute).toHaveBeenCalledWith({ username, payload });
  });

  it('should unfollow', async () => {
    await service.unfollow({ username, payload });
    expect(unfollow.execute).toHaveBeenCalledWith({ username, payload });
  });
});
