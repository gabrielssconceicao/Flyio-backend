import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { HashingService } from '@/hash/hashing.service';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { fileMock, profilePictureMock } from '@/image-store/mock/file.mock';
import { currentUserMock } from '../mocks/current-user.mock';
import { MeService } from '../me.service';
import { MeMapper } from '../me.mapper';
import { UpdateMeDto } from '../dto/update-me.dto';
import { ImageStoreService } from '@/image-store/image-store.service';
import { imageStoreServiceMock } from '@/image-store/mock/image-store.mock';

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
        .spyOn(imageStore, 'uploadProfileImage')
        .mockResolvedValue(profilePictureMock);
      jest
        .spyOn(imageStore, 'updateProfileImage')
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

      expect(imageStore.uploadProfileImage).toHaveBeenCalledWith({
        file: fileMock(),
        folder: 'profile',
      });

      expect(imageStore.updateProfileImage).toHaveBeenCalledWith({
        file: fileMock(),
        folder: 'banner',
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
});
