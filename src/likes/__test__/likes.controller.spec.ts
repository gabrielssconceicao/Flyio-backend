import { Test, TestingModule } from '@nestjs/testing';
import { payloadMock } from '@/auth/mock/token-payload.mock';
import { LikesController } from '../likes.controller';
import { LikesService } from '../likes.service';
import { Like } from '../use-cases/type';

describe('LikesController', () => {
  let controller: LikesController;
  let service: LikesService;

  let body: Like;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikesController],
      providers: [
        {
          provide: LikesService,
          useValue: { like: jest.fn(), deslike: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<LikesController>(LikesController);
    service = module.get<LikesService>(LikesService);
    body = { payload: payloadMock, postId: 'id-1' };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  it('should like a post', async () => {
    await controller.likePost('id-1', payloadMock);
    expect(service.like).toHaveBeenCalledWith(body);
  });

  it('should deslike a post', async () => {
    await controller.deslikePost('id-1', payloadMock);
    expect(service.deslike).toHaveBeenCalledWith(body);
  });
});
