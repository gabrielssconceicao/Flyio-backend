import { Test, TestingModule } from '@nestjs/testing';
import { MeController } from '../me.controller';
import { MeService } from '../me.service';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { userEntityMock } from '@/user/mocks/user-entity.mock';
import { UpdateMeDto } from '../dto/update-me.dto';
import { currentUserMock } from '../mocks/current-user.mock';

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
          useValue: { getMe: jest.fn(), updateMe: jest.fn() },
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
        user: {
          ...userEntityMock(),
          createdAt: new Date('2000-01-01T00:00:00.000Z'),
        },
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
        },
      });
      const result = await controller.updateMe(payload, updateMeDto);
      expect(service.updateMe).toHaveBeenCalledWith({
        user: payload,
        updateMeDto,
      });
      expect(result).toMatchSnapshot();
    });
  });
});
