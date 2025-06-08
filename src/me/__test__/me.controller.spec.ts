import { Test, TestingModule } from '@nestjs/testing';
import { MeController } from '../me.controller';
import { MeService } from '../me.service';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { UpdateMeDto } from '../dto/update-me.dto';
import { currentUserMock } from '../mocks/current-user.mock';
import { fileMock, profilePictureMock } from '@/image-store/mock/file.mock';
import { BadRequestException } from '@nestjs/common';

describe('MeController', () => {
  let controller: MeController;
  let service: MeService;
  let payload: JwtPayload;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeController],
      providers: [
        {
          provide: MeService,
          useValue: {
            getMe: jest.fn(),
            updateMe: jest.fn(),
            desactivateMe: jest.fn(),
            deleteProfileImage: jest.fn(),
            deleteBannerImage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MeController>(MeController);
    service = module.get<MeService>(MeService);
    payload = { id: 'id-1' } as JwtPayload;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GetMe', () => {
    it('should get current user', async () => {
      jest.spyOn(service, 'getMe').mockResolvedValue({
        user: currentUserMock(),
      });
      const result = await controller.getMe(payload);
      expect(service.getMe).toHaveBeenCalledWith(payload);
      expect(result).toMatchSnapshot();
    });
  });

  describe('UpdateMe', () => {
    it('should update current user', async () => {
      const updateMeDto: UpdateMeDto = {
        name: 'Updated name',
        bio: 'updated bio',
        password: 'newPassword',
      };
      jest.spyOn(service, 'updateMe').mockResolvedValue({
        user: {
          ...currentUserMock(),
          bio: updateMeDto.bio as string,
          name: updateMeDto.name as string,
          profileImg: profilePictureMock,
        },
      });
      const result = await controller.updateMe(payload, updateMeDto, {
        profileImg: [fileMock()],
        bannerImg: [],
      });
      expect(service.updateMe).toHaveBeenCalledWith({
        payload,
        updateMeDto,
        bannerImage: null,
        profileImage: fileMock(),
      });
      expect(result).toMatchSnapshot();
    });
  });

  describe('DesactivateMe', () => {
    it('should desactivate current user', async () => {
      await controller.desactivateMe(payload);
      expect(service.desactivateMe).toHaveBeenCalledWith(payload);
    });
  });

  describe('DeleteProfileImage', () => {
    it('should delete profile image', async () => {
      jest.spyOn(service, 'deleteProfileImage').mockResolvedValue();
      await controller.deleteProfileImage(payload);
      expect(service.deleteProfileImage).toHaveBeenCalledWith({ payload });
    });

    it('should thow an BadRequestException', async () => {
      jest
        .spyOn(service, 'deleteProfileImage')
        .mockRejectedValue(new BadRequestException());
      await expect(controller.deleteProfileImage(payload)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('DeleteBannerImage', () => {
    it('should delete banner image', async () => {
      jest.spyOn(service, 'deleteBannerImage').mockResolvedValue();
      await controller.deleteBannerImage(payload);
      expect(service.deleteBannerImage).toHaveBeenCalledWith({ payload });
    });

    it('should thow an BadRequestException', async () => {
      jest
        .spyOn(service, 'deleteBannerImage')
        .mockRejectedValue(new BadRequestException());
      await expect(controller.deleteBannerImage(payload)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
