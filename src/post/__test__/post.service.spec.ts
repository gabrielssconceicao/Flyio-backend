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

describe('PostService', () => {
  let service: PostService;
  let imageStore: ReturnType<typeof postImageStoreUseCaseMock>;
  let primsa: ReturnType<typeof prismaServiceMock>;
  let payload: JwtPayload;
  const _countLikesAndReplies = { _count: { likes: 0, replies: 0 }, likes: [] };

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
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    imageStore = module.get(PostImageStoreUseCase);
    primsa = module.get(PrismaService);
    payload = { id: 'id-1' } as JwtPayload;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(imageStore).toBeDefined();
    expect(primsa).toBeDefined();
  });

  describe('Create', () => {
    it('should create a post without images', async () => {
      jest
        .spyOn(primsa.post, 'create')
        .mockResolvedValue({ ...postMock(), images: [] });

      const result = await service.create({
        createPostDto: { content: 'This is a post' },
        payload,
        images: [],
      });

      expect(imageStore.uploadPostImages).not.toHaveBeenCalled();
      expect(primsa.post.create).toHaveBeenCalled();

      expect(result).toEqual({ ...postMock(), images: [] });
      expect(result).toMatchSnapshot();
    });
    it('should create a post with images', async () => {
      jest.spyOn(primsa.post, 'create').mockResolvedValue(postMock());
      jest
        .spyOn(imageStore, 'uploadPostImages')
        .mockResolvedValue([profilePictureMock]);

      const result = await service.create({
        createPostDto: { content: 'This is a post' },
        payload,
        images: [fileMock()],
      });

      expect(imageStore.uploadPostImages).toHaveBeenCalled();
      expect(primsa.post.create).toHaveBeenCalled();

      expect(result).toEqual(postMock());
      expect(result).toMatchSnapshot();
    });
  });

  describe('Delete', () => {
    it('should delete a post', async () => {
      jest.spyOn(primsa.post, 'findUnique').mockResolvedValue(postMock());

      await service.delete({ postId: postMock().id, payload });
      expect(imageStore.deletePostImages).toHaveBeenCalled();
      expect(primsa.post.delete).toHaveBeenCalled();
    });

    it('should throw a not found exception if post not found', async () => {
      jest.spyOn(primsa.post, 'findUnique').mockResolvedValue(null);
      await expect(
        service.delete({ postId: postMock().id, payload }),
      ).rejects.toThrow(NotFoundException);
    });
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
