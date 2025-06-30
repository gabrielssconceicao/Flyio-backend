import { Test, TestingModule } from '@nestjs/testing';
import { FollowController } from '../follow.controller';
import { FollowService } from '../follow.service';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';

describe('FollowController', () => {
  let controller: FollowController;
  let service: FollowService;
  const payload = { username: 'johndoe', id: 'id-1' } as JwtPayload;
  const username = 'otherjohndoe';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowController],
      providers: [
        {
          provide: FollowService,
          useValue: {
            follow: jest.fn(),
            unfollow: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FollowController>(FollowController);
    service = module.get<FollowService>(FollowService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should follow a user', async () => {
    await controller.follow(payload, username);
    expect(service.follow).toHaveBeenCalledWith({
      username,
      payload,
    });
  });

  it('should unfollow a user', async () => {
    await controller.unfollow(payload, username);
    expect(service.unfollow).toHaveBeenCalledWith({
      username,
      payload,
    });
  });
});
