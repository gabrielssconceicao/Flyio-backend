import { Test, TestingModule } from '@nestjs/testing';
import { payloadMock } from '@/auth/mock/token-payload.mock';
import { LikesService } from '../likes.service';
import { DislikePostUseCase, LikePostUseCase } from '../use-cases';
import { Like } from '../use-cases/type';
const mock = {
  execute: jest.fn(),
};
describe('LikesService', () => {
  let service: LikesService;
  let likePost: LikePostUseCase;
  let dislikePost: DislikePostUseCase;
  let body: Like;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        {
          provide: LikePostUseCase,
          useValue: mock,
        },
        {
          provide: DislikePostUseCase,
          useValue: mock,
        },
      ],
    }).compile();

    service = module.get<LikesService>(LikesService);
    likePost = module.get<LikePostUseCase>(LikePostUseCase);
    dislikePost = module.get<DislikePostUseCase>(DislikePostUseCase);
    body = { payload: payloadMock, postId: 'id-1' };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(likePost).toBeDefined();
    expect(dislikePost).toBeDefined();
  });

  it('should like a post', async () => {
    await service.like(body);
    expect(likePost.execute).toHaveBeenCalledWith(body);
  });
  it('should dislike a post', async () => {
    await service.deslike(body);
    expect(dislikePost.execute).toHaveBeenCalledWith(body);
  });
});
