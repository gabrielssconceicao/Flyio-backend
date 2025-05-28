import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { HashingService } from '@/hash/hashing.service';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { currentUserMock } from '../mocks/current-user.mock';
import { MeService } from '../me.service';
import { MeMapper } from '../me.mapper';
import { UpdateMeDto } from '../dto/update-me.dto';

describe('MeService', () => {
  let service: MeService;
  let prisma: ReturnType<typeof prismaServiceMock>;
  let hashing: HashingService;
  let payload: JwtPayload;
  beforeEach(async () => {
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
      ],
    }).compile();

    service = module.get<MeService>(MeService);
    hashing = module.get<HashingService>(HashingService);
    payload = { id: 'id-1' } as JwtPayload;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
    expect(hashing).toBeDefined();
  });

  describe('GetMe', () => {
    it('should get current user', async () => {
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue(currentUserMock() as any);

      const result = await service.getMe(payload);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: payload.id,
        },
        select: MeMapper.defaultFields,
      });
      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });
  });

  describe('UpdateMe', () => {
    it('should update current user', async () => {
      const updateMeDto: UpdateMeDto = {
        name: 'Updated name',
        bio: 'updated bio',
      };
      jest
        .spyOn(prisma.user, 'update')
        .mockResolvedValue({ ...currentUserMock(), ...updateMeDto });

      const result = await service.updateMe({ payload, updateMeDto });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: payload.id,
        },
        data: {
          name: updateMeDto.name,
          bio: updateMeDto.bio,
          password: undefined,
        },
        select: MeMapper.defaultFields,
      });
      expect(hashing.hash).not.toHaveBeenCalled();
      expect(result).toEqual({
        user: {
          ...currentUserMock(),
          ...updateMeDto,
        },
      });
      expect(result).toMatchSnapshot();
    });
    it('should update current user password', async () => {
      jest.spyOn(hashing, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(prisma.user, 'update').mockResolvedValue({
        ...currentUserMock(),
      });
      const result = await service.updateMe({
        payload,
        updateMeDto: {
          password: 'newPassword',
        },
      });

      expect(hashing.hash).toHaveBeenCalledWith('newPassword');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: payload.id,
        },
        data: {
          name: undefined,
          bio: undefined,
          password: 'hashedPassword',
        },
        select: MeMapper.defaultFields,
      });
      expect(result).toBeDefined();

      expect(result).toMatchSnapshot();
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
