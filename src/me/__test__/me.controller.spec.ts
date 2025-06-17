import { Test, TestingModule } from '@nestjs/testing';

import { fileMock, profilePictureMock } from '@/image-store/mock/file.mock';
import { payloadMock } from '@/auth/mock/token-payload.mock';

import { MeController } from '../me.controller';
import { MeService } from '../me.service';
import { UpdateMeDto } from '../dto/update-me.dto';
import { currentUserMock } from '../mocks/current-user.mock';

describe('MeController', () => {
  let controller: MeController;
  let service: MeService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeController],
      providers: [
        {
          provide: MeService,
          useValue: {
            get: jest.fn(),
            update: jest.fn(),
            desactivate: jest.fn(),
            deleteProfileImage: jest.fn(),
            deleteBannerImage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MeController>(MeController);
    service = module.get<MeService>(MeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GetMe', () => {
    it('should get current user', async () => {
      jest.spyOn(service, 'get').mockResolvedValue({
        user: currentUserMock(),
      });
      const result = await controller.getMe(payloadMock);
      expect(service.get).toHaveBeenCalledWith(payloadMock);
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
      jest.spyOn(service, 'update').mockResolvedValue({
        user: {
          ...currentUserMock(),
          bio: updateMeDto.bio as string,
          name: updateMeDto.name as string,
          profileImg: profilePictureMock,
        },
      });
      const result = await controller.updateMe(payloadMock, updateMeDto, {
        profileImg: [fileMock()],
        bannerImg: [],
      });
      expect(service.update).toHaveBeenCalledWith({
        payload: payloadMock,
        updateMeDto,
        bannerImage: null,
        profileImage: fileMock(),
      });
      expect(result).toMatchSnapshot();
    });
  });

  describe('DesactivateMe', () => {
    it('should desactivate current user', async () => {
      await controller.desactivateMe(payloadMock);
      expect(service.desactivate).toHaveBeenCalledWith(payloadMock);
    });
  });

  describe('DeleteProfileImage', () => {
    it('should delete profile image', async () => {
      jest.spyOn(service, 'deleteProfileImage').mockResolvedValue();
      await controller.deleteProfileImage(payloadMock);
      expect(service.deleteProfileImage).toHaveBeenCalledWith({
        payload: payloadMock,
      });
    });
  });

  describe('DeleteBannerImage', () => {
    it('should delete banner image', async () => {
      jest.spyOn(service, 'deleteBannerImage').mockResolvedValue();
      await controller.deleteBannerImage(payloadMock);
      expect(service.deleteBannerImage).toHaveBeenCalledWith({
        payload: payloadMock,
      });
    });
  });
});
