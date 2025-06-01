import { Test, TestingModule } from '@nestjs/testing';
import { FollowController } from '../follow.controller';
import { FollowService } from '../follow.service';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('FollowController', () => {
  let controller: FollowController;
  let service: FollowService;
  const payload = { id: 'id-1' } as JwtPayload;
  const id = 'id-2';
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

  describe('Follow', () => {
    it('should follow a user', async () => {
      await controller.follow(payload, id);
      expect(service.follow).toHaveBeenCalledWith({
        followingUserId: id,
        payload,
      });
    });
    it('should thow an BadRequestException', async () => {
      jest
        .spyOn(service, 'follow')
        .mockRejectedValue(new BadRequestException());
      await expect(controller.follow(payload, id)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should thow an NotFoundException', async () => {
      jest.spyOn(service, 'follow').mockRejectedValue(new NotFoundException());
      await expect(controller.follow(payload, id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Unfollow', () => {
    it('should unfollow a user', async () => {
      await controller.unfollow(payload, id);
      expect(service.unfollow).toHaveBeenCalledWith({
        followingUserId: id,
        payload,
      });
    });

    it('should thow an BadRequestException', async () => {
      jest
        .spyOn(service, 'unfollow')
        .mockRejectedValue(new BadRequestException());
      await expect(controller.unfollow(payload, id)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should thow an NotFoundException', async () => {
      jest
        .spyOn(service, 'unfollow')
        .mockRejectedValue(new NotFoundException());
      await expect(controller.unfollow(payload, id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
