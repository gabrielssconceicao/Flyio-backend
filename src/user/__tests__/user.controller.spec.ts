import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { createUserDtoMock } from '../mocks/create-user-dto.mock';
import { HashingModule } from '@/hash/hashing.module';
import { userEntityMock } from '../mocks/user-entity.mock';
import { ConflictException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HashingModule],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('<create />', () => {
    it('should create a user', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(userEntityMock());
      const result = await controller.create(createUserDtoMock());
      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });

    it('should throw a conflict exception', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new ConflictException());
      await expect(controller.create(createUserDtoMock())).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
