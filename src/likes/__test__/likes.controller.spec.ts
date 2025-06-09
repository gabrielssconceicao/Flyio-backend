import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { LikesController } from '../likes.controller';
import { LikesService } from '../likes.service';

describe('LikesController', () => {
  let controller: LikesController;
  let service: LikesService;
  let payload: JwtPayload;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikesController],
      providers: [
        {
          provide: LikesService,
          useValue: { likePost: jest.fn(), deslikePost: jest.fn() },
        },
      ],
    }).compile();

    payload = { id: 'id-1' } as JwtPayload;
    controller = module.get<LikesController>(LikesController);
    service = module.get<LikesService>(LikesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  describe('Like', () => {
    it('should like a post', async () => {
      await controller.likePost('id-1', payload);
      expect(service.likePost).toHaveBeenCalledWith({
        payload,
        postId: 'id-1',
      });
    });

    it('should thow NotFoundException', async () => {
      jest
        .spyOn(service, 'likePost')
        .mockRejectedValue(new NotFoundException());
      await expect(controller.likePost('id-1', payload)).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should thow BadRequestException', async () => {
      jest
        .spyOn(service, 'likePost')
        .mockRejectedValue(new BadRequestException());
      await expect(controller.likePost('id-1', payload)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('Deslike', () => {
    it('should deslike a post', async () => {
      await controller.deslikePost('id-1', payload);
      expect(service.deslikePost).toHaveBeenCalledWith({
        payload,
        postId: 'id-1',
      });
    });

    it('should thow NotFoundException', async () => {
      jest
        .spyOn(service, 'deslikePost')
        .mockRejectedValue(new NotFoundException());
      await expect(controller.deslikePost('id-1', payload)).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should thow BadRequestException', async () => {
      jest
        .spyOn(service, 'deslikePost')
        .mockRejectedValue(new BadRequestException());
      await expect(controller.deslikePost('id-1', payload)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
