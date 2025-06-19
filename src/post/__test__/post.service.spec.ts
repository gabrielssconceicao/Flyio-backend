import { Test, TestingModule } from '@nestjs/testing';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { PostImageStoreUseCase } from '@/image-store/use-cases';
import { postImageStoreUseCaseMock } from '@/image-store/mock';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { PrismaService } from '@/prisma/prisma.service';
import { findManyPostMock, findOnePostMock, postMock } from '../mock';
import { PostService } from '../post.service';
import { fileMock, profilePictureMock } from '@/image-store/mock/file.mock';
import {
  CreatePostUseCase,
  DeletePostUseCase,
  FindManyPostUseCase,
  FindOnePostUseCase,
} from '../use-cases';

const mock = {
  execute: jest.fn(),
};

describe('PostService', () => {
  let service: PostService;
  let imageStore: ReturnType<typeof postImageStoreUseCaseMock>;
  let primsa: ReturnType<typeof prismaServiceMock>;
  let payload: JwtPayload;

  let createPost: CreatePostUseCase;
  let deletePost: DeletePostUseCase;
  let findOnePost: FindOnePostUseCase;
  let findManyPost: FindManyPostUseCase;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock(),
        },

        {
          provide: PostImageStoreUseCase,
          useValue: postImageStoreUseCaseMock(),
        },
        {
          provide: CreatePostUseCase,
          useValue: mock,
        },
        {
          provide: DeletePostUseCase,
          useValue: mock,
        },
        {
          provide: FindOnePostUseCase,
          useValue: mock,
        },
        {
          provide: FindManyPostUseCase,
          useValue: mock,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    imageStore = module.get(PostImageStoreUseCase);
    primsa = module.get(PrismaService);
    payload = { id: 'id-1' } as JwtPayload;

    createPost = module.get<CreatePostUseCase>(CreatePostUseCase);
    deletePost = module.get<DeletePostUseCase>(DeletePostUseCase);
    findOnePost = module.get<FindOnePostUseCase>(FindOnePostUseCase);
    findManyPost = module.get<FindManyPostUseCase>(FindManyPostUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(imageStore).toBeDefined();
    expect(primsa).toBeDefined();
    expect(createPost).toBeDefined();
    expect(deletePost).toBeDefined();
    expect(findOnePost).toBeDefined();
    expect(findManyPost).toBeDefined();
  });

  it('should create a post', async () => {
    jest.spyOn(createPost, 'execute').mockResolvedValue(postMock());
    const body = {
      createPostDto: {
        content: 'Text',
      },
      payload,
      images: [],
    };
    const result = await service.create(body);
    expect(createPost.execute).toHaveBeenCalledWith(body);
    expect(result).toBeDefined();
    expect(result).toMatchSnapshot();
  });

  it('should delete a post', async () => {
    await service.delete({ payload, postId: 'id-1' });
    expect(deletePost.execute).toHaveBeenCalled();
  });

  it('should find a post', async () => {
    jest.spyOn(findOnePost, 'execute').mockResolvedValue(findOnePostMock());

    const result = await service.findOne({
      payload,
      postId: 'id-1',
    });

    expect(findOnePost.execute).toHaveBeenCalledWith({
      payload,
      postId: 'id-1',
    });
    expect(result).toBeDefined();
    expect(result).toMatchSnapshot();
  });

  it('should search posts', async () => {
    jest.spyOn(findManyPost, 'execute').mockResolvedValue(findManyPostMock());
    const body = {
      payload,
      query: {},
    };
    const result = await service.findMany(body);

    expect(findManyPost.execute).toHaveBeenCalledWith(body);
    expect(result).toBeDefined();
    expect(result).toEqual(findManyPostMock());
    expect(result).toMatchSnapshot();
  });

  describe('Commennt', () => {
    it('should comment a post without images', async () => {
      jest.spyOn(primsa.post, 'create').mockResolvedValue({
        ...postMock(),
        images: [],
        parent: { author: { username: 'johndoe' } },
      });

      const result = await service.comment({
        postId: postMock().id,
        createPostDto: { content: 'This is a post' },
        payload,
        images: [],
      });

      expect(imageStore.uploadPostImages).not.toHaveBeenCalled();
      expect(primsa.post.create).toHaveBeenCalled();

      expect(result).toEqual({
        ...postMock(),
        images: [],
        parent: { author: { username: 'johndoe' } },
      });
      expect(result).toMatchSnapshot();
    });
    it('should create a post with images', async () => {
      jest.spyOn(primsa.post, 'create').mockResolvedValue({
        ...postMock(),
        parent: { author: { username: 'johndoe' } },
      });
      jest
        .spyOn(imageStore, 'uploadPostImages')
        .mockResolvedValue([profilePictureMock]);

      const result = await service.comment({
        postId: postMock().id,
        createPostDto: { content: 'This is a post' },
        payload,
        images: [fileMock()],
      });

      expect(imageStore.uploadPostImages).toHaveBeenCalled();
      expect(primsa.post.create).toHaveBeenCalled();

      expect(result).toEqual({
        ...postMock(),
        parent: { author: { username: 'johndoe' } },
      });
      expect(result).toMatchSnapshot();
    });
  });
});
