import { Test, TestingModule } from '@nestjs/testing';
import { PostImageStoreUseCase } from '@/image-store/use-cases';
import { postImageStoreUseCaseMock } from '@/image-store/mock';
import { fileMock, profilePictureMock } from '@/image-store/mock/file.mock';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { PrismaService } from '@/prisma/prisma.service';
import { payloadMock } from '@/auth/mock/token-payload.mock';
import { postMock } from '../mock';
import { ReplyPostUseCase } from '../use-cases';

describe('ReplyPostUseCase', () => {
  let useCase: ReplyPostUseCase;
  let imageStore: PostImageStoreUseCase;
  let prisma: ReturnType<typeof prismaServiceMock>;

  beforeEach(async () => {
    prisma = prismaServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReplyPostUseCase,
        {
          provide: PrismaService,
          useValue: prisma,
        },

        {
          provide: PostImageStoreUseCase,
          useValue: postImageStoreUseCaseMock(),
        },
      ],
    }).compile();

    useCase = module.get<ReplyPostUseCase>(ReplyPostUseCase);
    imageStore = module.get(PostImageStoreUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(imageStore).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should comment a post without images', async () => {
    jest.spyOn(prisma.post, 'create').mockResolvedValue({
      ...postMock(),
      parentId: postMock().id,
      images: [],
      parent: { author: { username: 'johndoe' } },
    });

    const result = await useCase.execute({
      postId: postMock().id,
      createPostDto: { content: 'This is a post' },
      payload: payloadMock,
      images: [],
    });

    expect(imageStore.uploadPostImages).not.toHaveBeenCalled();
    expect(prisma.post.create).toHaveBeenCalled();

    expect(result).toEqual({
      ...postMock(),
      images: [],
      parentId: postMock().id,
      parent: { author: { username: 'johndoe' } },
    });
    expect(result).toMatchSnapshot();
  });
  it('should comment a post with images', async () => {
    jest.spyOn(prisma.post, 'create').mockResolvedValue({
      ...postMock(),
      parentId: postMock().id,
      parent: { author: { username: 'johndoe' } },
    });
    jest
      .spyOn(imageStore, 'uploadPostImages')
      .mockResolvedValue([profilePictureMock]);

    const result = await useCase.execute({
      postId: postMock().id,
      createPostDto: { content: 'This is a post' },
      payload: payloadMock,
      images: [fileMock()],
    });

    expect(imageStore.uploadPostImages).toHaveBeenCalled();
    expect(prisma.post.create).toHaveBeenCalled();

    expect(result).toEqual({
      ...postMock(),
      parentId: postMock().id,
      parent: { author: { username: 'johndoe' } },
    });
    expect(result).toMatchSnapshot();
  });
});
