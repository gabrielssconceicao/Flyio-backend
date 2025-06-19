import { Test, TestingModule } from '@nestjs/testing';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { PostImageStoreUseCase } from '@/image-store/use-cases';
import { postImageStoreUseCaseMock } from '@/image-store/mock';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { PrismaService } from '@/prisma/prisma.service';
import { findManyPostMock, postMock } from '../mock';
import { PostService } from '../post.service';
import { NotFoundException } from '@nestjs/common';
import { fileMock, profilePictureMock } from '@/image-store/mock/file.mock';
import { CreatePostUseCase, DeletePostUseCase } from '../use-cases';
describe('PostService', () => {
  let service: PostService;
  let imageStore: ReturnType<typeof postImageStoreUseCaseMock>;
  let primsa: ReturnType<typeof prismaServiceMock>;
  let payload: JwtPayload;
  const _countLikesAndReplies = { _count: { likes: 0, replies: 0 }, likes: [] };

  let createPost: CreatePostUseCase;
  let deletePost: DeletePostUseCase;
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
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: DeletePostUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    imageStore = module.get(PostImageStoreUseCase);
    primsa = module.get(PrismaService);
    payload = { id: 'id-1' } as JwtPayload;

    createPost = module.get<CreatePostUseCase>(CreatePostUseCase);
    deletePost = module.get<DeletePostUseCase>(DeletePostUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(imageStore).toBeDefined();
    expect(primsa).toBeDefined();
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

  describe('FindOne', () => {
    it('should return a post', async () => {
      jest.spyOn(primsa.post, 'findUnique').mockResolvedValue({
        ...postMock(),
        ..._countLikesAndReplies,
        replies: [],
        parent: null,
      });

      const result = await service.findOne({
        postId: postMock().id,
        payload,
      });

      expect(primsa.post.findUnique).toHaveBeenCalled();
      expect(result).toMatchSnapshot();
    });

    it('should throw a not found exception if post not found', async () => {
      jest.spyOn(primsa.post, 'findUnique').mockResolvedValue(null);
      await expect(
        service.findOne({
          postId: postMock().id,
          payload,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('FindMany', () => {
    it('should return an array of post', async () => {
      jest.spyOn(primsa.post, 'findMany').mockResolvedValue(
        findManyPostMock().items.map((post) => ({
          ...post,
          ..._countLikesAndReplies,
        })),
      );
      jest
        .spyOn(primsa.post, 'count')
        .mockResolvedValue(findManyPostMock().count);

      const result = await service.findMany({
        payload,
        query: {},
      });

      expect(primsa.post.findMany).toHaveBeenCalled();
      expect(primsa.post.count).toHaveBeenCalled();
      expect(result).toEqual(findManyPostMock());
      expect(result).toMatchSnapshot();
    });
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
