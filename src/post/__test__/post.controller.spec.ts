import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from '../post.controller';
import { PostService } from '../post.service';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { findManyPostMock, postMock } from '../mock';
import { fileMock } from '@/image-store/mock/file.mock';

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;
  let payload: JwtPayload;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            create: jest.fn(),
            findMany: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
    payload = { id: 'id-1' } as JwtPayload;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Create', () => {
    it('should return a post', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(postMock());
      const images = [fileMock()];
      const createPostDto = { content: 'This is a post' };
      const result = await controller.create(images, createPostDto, payload);
      expect(result).toEqual(postMock());
      expect(service.create).toHaveBeenCalledWith({
        createPostDto,
        payload,
        images,
      });
      expect(result).toMatchSnapshot();
    });
  });

  describe('Delete', () => {
    it('should delete a post', async () => {
      await controller.delete(postMock().id, payload);
      expect(service.delete).toHaveBeenCalledWith({
        postId: postMock().id,
        payload,
      });
    });
  });

  describe('FindOne', () => {
    it('should return a post', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ ...postMock(), comments: [], parent: null });
      const result = await controller.findOne(postMock().id, payload);
      expect(service.findOne).toHaveBeenCalledWith({
        postId: postMock().id,
        payload,
      });
      expect(result).toMatchSnapshot();
    });
  });

  describe('FindMany', () => {
    it('should return an array of post', async () => {
      jest.spyOn(service, 'findMany').mockResolvedValue(findManyPostMock());
      const result = await controller.findMany(payload, {});
      expect(result).toEqual(findManyPostMock());
      expect(service.findMany).toHaveBeenCalledWith({
        payload,
        query: {},
      });
      expect(result).toMatchSnapshot();
    });
  });
});
