import { Test, TestingModule } from '@nestjs/testing';
import { PostImageStoreUseCase } from '@/image-store/use-cases';
import { postImageStoreUseCaseMock } from '@/image-store/mock';
import { fileMock, profilePictureMock } from '@/image-store/mock/file.mock';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { PrismaService } from '@/prisma/prisma.service';
import { payloadMock } from '@/auth/mock/token-payload.mock';
import { postMock } from '../mock';
import { CreatePostUseCase } from '../use-cases';

describe('CreatePostUseCase', () => {
  let useCase: CreatePostUseCase;
  let imageStore: PostImageStoreUseCase;
  let prisma: ReturnType<typeof prismaServiceMock>;

  beforeEach(async () => {
    prisma = prismaServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePostUseCase,
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

    useCase = module.get<CreatePostUseCase>(CreatePostUseCase);
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

  it('should create a post without images', async () => {
    jest
      .spyOn(prisma.post, 'create')
      .mockResolvedValue({ ...postMock(), images: [] });

    const result = await useCase.execute({
      createPostDto: { content: 'This is a post' },
      payload: payloadMock,
      images: [],
    });

    expect(imageStore.uploadPostImages).not.toHaveBeenCalled();
    expect(prisma.post.create).toHaveBeenCalled();

    expect(result).toEqual({ ...postMock(), images: [] });
    expect(result).toMatchSnapshot();
  });
  it('should create a post with images', async () => {
    jest.spyOn(prisma.post, 'create').mockResolvedValue(postMock());
    jest
      .spyOn(imageStore, 'uploadPostImages')
      .mockResolvedValue([profilePictureMock]);

    const result = await useCase.execute({
      createPostDto: { content: 'This is a post' },
      payload: payloadMock,
      images: [fileMock()],
    });

    expect(imageStore.uploadPostImages).toHaveBeenCalled();
    expect(prisma.post.create).toHaveBeenCalled();

    expect(result).toEqual(postMock());
    expect(result).toMatchSnapshot();
  });
});
