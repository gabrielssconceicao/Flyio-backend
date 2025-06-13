import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { PrismaService } from '@/prisma/prisma.service';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { HashingService } from '@/hash/hashing.service';
import { ImageStoreService } from '@/image-store/image-store.service';
import { fileMock, profilePictureMock } from '@/image-store/mock/file.mock';
import { imageStoreServiceMock } from '@/image-store/mock/image-store.mock';
import { ImageStoreTypeFolder } from '@/image-store/image-store.constants';
import { currentUserMock } from '../mocks/current-user.mock';
import { MeService } from '../me.service';
import { MeMapper } from '../me.mapper';
import { UpdateMeDto } from '../dto/update-me.dto';

describe('MeService', () => {
  let service: MeService;
  let prisma: ReturnType<typeof prismaServiceMock>;
  let hashing: HashingService;
  let payload: JwtPayload;
  let imageStore: ImageStoreService;
  let _count: { _count: { followers: number; following: number } };
  beforeEach(async () => {
    _count = { _count: { followers: 0, following: 0 } };
    prisma = prismaServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
        {
          provide: ImageStoreService,
          useValue: imageStoreServiceMock(),
        },
      ],
    }).compile();

    service = module.get<MeService>(MeService);
    hashing = module.get<HashingService>(HashingService);
    imageStore = module.get<ImageStoreService>(ImageStoreService);
    payload = { id: 'id-1' } as JwtPayload;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
    expect(hashing).toBeDefined();
    expect(imageStore).toBeDefined();
  });

  describe('GetMe', () => {
    it('should get current user', async () => {
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue({ ...currentUserMock(), ..._count } as any);

      const result = await service.getMe(payload);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: payload.id,
        },
        select: { ...MeMapper.defaultFields, ...MeMapper.followCountFields },
      });
      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });
  });

  describe('UpdateMe', () => {
    it('should update current user', async () => {
      const hashedPassword = 'hashedPassword';
      const updateMeDto: UpdateMeDto = {
        name: 'Updated name',
        password: 'newPassword',
      };

      jest.spyOn(hashing, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(prisma.user, 'update').mockResolvedValue({
        ...currentUserMock(),
        ..._count,
        password: hashedPassword,
      } as any);

      const result = await service.updateMe({
        payload,
        updateMeDto,
        bannerImage: null,
        profileImage: null,
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: payload.id,
        },
        data: {
          name: updateMeDto.name,
          password: hashedPassword,
          bannerImg: undefined,
          profileImg: undefined,
        },
        select: { ...MeMapper.defaultFields, ...MeMapper.followCountFields },
      });
      expect(hashing.hash).toHaveBeenCalledWith(updateMeDto.password);
      expect(result).toMatchSnapshot();
    });

    it('should update current user with images', async () => {
      const uppdateMeDto: UpdateMeDto = {
        password: undefined,
        bio: undefined,
        name: undefined,
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        bannerImg: profilePictureMock,
        profileImg: null,
      });

      jest
        .spyOn(imageStore, 'uploadUserImage')
        .mockResolvedValue(profilePictureMock);
      jest
        .spyOn(imageStore, 'updateUserImage')
        .mockResolvedValue(profilePictureMock);

      jest.spyOn(prisma.user, 'update').mockResolvedValue({
        ...currentUserMock(),
        ..._count,
        prfileImg: profilePictureMock,
        bannerImg: profilePictureMock,
      });

      const result = await service.updateMe({
        payload,
        updateMeDto: uppdateMeDto,
        bannerImage: fileMock(),
        profileImage: fileMock(),
      });

      expect(result).toMatchSnapshot();

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: payload.id,
        },
        select: { bannerImg: true, profileImg: true },
      });

      expect(imageStore.uploadUserImage).toHaveBeenCalledWith({
        file: fileMock(),
        folder: ImageStoreTypeFolder.PROFILE,
      });

      expect(imageStore.updateUserImage).toHaveBeenCalledWith({
        file: fileMock(),
        folder: ImageStoreTypeFolder.BANNER,
        filename: profilePictureMock,
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: payload.id,
        },
        data: {
          ...uppdateMeDto,
          bannerImg: profilePictureMock,
          profileImg: profilePictureMock,
        },
        select: { ...MeMapper.defaultFields, ...MeMapper.followCountFields },
      });
    });
  });

  describe('DesactivateMe', () => {
    it('should desactivate current user', async () => {
      await service.desactivateMe(payload);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: payload.id,
        },
        data: {
          isActive: false,
        },
      });
    });
  });

  describe('DeleteProfileImage', () => {
    it('should delete profile image', async () => {
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue({ profileImg: profilePictureMock });
      jest.spyOn(imageStore, 'deleteImage').mockResolvedValue({ result: 'ok' });
      await service.deleteProfileImage({ payload });
      expect(imageStore.deleteImage).toHaveBeenCalledWith({
        fileUrl: profilePictureMock,
        folder: ImageStoreTypeFolder.PROFILE,
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: payload.id,
        },
        select: { profileImg: true },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: payload.id,
        },
        data: {
          profileImg: null,
        },
      });
    });
    it('should thow an BadRequestException', async () => {
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue({ profileImg: profilePictureMock });
      jest
        .spyOn(imageStore, 'deleteImage')
        .mockResolvedValue({ result: 'not_found' });
      await expect(service.deleteProfileImage({ payload })).rejects.toThrow(
        BadRequestException,
      );
      expect(imageStore.deleteImage).toHaveBeenCalledWith({
        fileUrl: profilePictureMock,
        folder: ImageStoreTypeFolder.PROFILE,
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: payload.id,
        },
        select: { profileImg: true },
      });
    });
  });

  describe('DeleteBannerImage', () => {
    it('should delete profile image', async () => {
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue({ bannerImg: profilePictureMock });
      jest.spyOn(imageStore, 'deleteImage').mockResolvedValue({ result: 'ok' });
      await service.deleteBannerImage({ payload });
      expect(imageStore.deleteImage).toHaveBeenCalledWith({
        fileUrl: profilePictureMock,
        folder: ImageStoreTypeFolder.BANNER,
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: payload.id,
        },
        select: { bannerImg: true },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: payload.id,
        },
        data: {
          bannerImg: null,
        },
      });
    });
    it('should thow an BadRequestException', async () => {
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue({ bannerImg: profilePictureMock });
      jest
        .spyOn(imageStore, 'deleteImage')
        .mockResolvedValue({ result: 'not_found' });
      await expect(service.deleteBannerImage({ payload })).rejects.toThrow(
        BadRequestException,
      );
      expect(imageStore.deleteImage).toHaveBeenCalledWith({
        fileUrl: profilePictureMock,
        folder: ImageStoreTypeFolder.BANNER,
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: payload.id,
        },
        select: { bannerImg: true },
      });
    });
  });
});
