import { Test, TestingModule } from '@nestjs/testing';

import { payloadMock } from '@/auth/mock/token-payload.mock';

import { MeService } from '../me.service';
import {
  DeleteBannerImageUseCase,
  DeleteProfileImageUseCase,
  DesactivateMeUserCase,
  GetMeUseCase,
  UpdateMeUseCase,
} from '../use-cases';
import { currentUserMock } from '../mocks/current-user.mock';

describe('MeService', () => {
  let service: MeService;
  let deleteBannerImageUseCase: DeleteBannerImageUseCase;
  let deleteProfileImageUseCase: DeleteProfileImageUseCase;
  let desactivateMeUseCase: DesactivateMeUserCase;
  let getMeUseCase: GetMeUseCase;
  let updateMeUseCase: UpdateMeUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeService,
        {
          provide: DeleteBannerImageUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: DeleteProfileImageUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: DesactivateMeUserCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetMeUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UpdateMeUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MeService>(MeService);
    deleteBannerImageUseCase = module.get<DeleteBannerImageUseCase>(
      DeleteBannerImageUseCase,
    );
    deleteProfileImageUseCase = module.get<DeleteProfileImageUseCase>(
      DeleteProfileImageUseCase,
    );
    desactivateMeUseCase = module.get<DesactivateMeUserCase>(
      DesactivateMeUserCase,
    );
    getMeUseCase = module.get<GetMeUseCase>(GetMeUseCase);
    updateMeUseCase = module.get<UpdateMeUseCase>(UpdateMeUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(deleteBannerImageUseCase).toBeDefined();
    expect(deleteProfileImageUseCase).toBeDefined();
    expect(desactivateMeUseCase).toBeDefined();
    expect(getMeUseCase).toBeDefined();
    expect(updateMeUseCase).toBeDefined();
  });

  it('should get me', async () => {
    jest
      .spyOn(getMeUseCase, 'execute')
      .mockResolvedValue({ user: currentUserMock() });
    const result = await service.get(payloadMock);
    expect(result).toBeDefined();
    expect(getMeUseCase.execute).toHaveBeenCalledWith({ id: payloadMock.id });
    expect(result).toMatchSnapshot();
  });

  it('should update me', async () => {
    jest
      .spyOn(updateMeUseCase, 'execute')
      .mockResolvedValue({ user: currentUserMock() });
    const result = await service.update({
      payload: payloadMock,
      updateMeDto: {
        name: 'name',
        bio: 'bio',
        password: 'password',
      },
      bannerImage: null,
      profileImage: null,
    });
    expect(result).toBeDefined();
    expect(updateMeUseCase.execute).toHaveBeenCalledWith({
      payload: payloadMock,
      updateMeDto: {
        name: 'name',
        bio: 'bio',
        password: 'password',
      },
      bannerImage: null,
      profileImage: null,
    });
    expect(result).toMatchSnapshot();
  });

  it('should desactivate me', async () => {
    await service.desactivate(payloadMock);
    expect(desactivateMeUseCase.execute).toHaveBeenCalledWith({
      id: payloadMock.id,
    });
  });

  it('should delete profile image', async () => {
    await service.deleteProfileImage({ payload: payloadMock });
    expect(deleteProfileImageUseCase.execute).toHaveBeenCalledWith({
      id: payloadMock.id,
    });
  });

  it('should delete banner image', async () => {
    await service.deleteBannerImage({ payload: payloadMock });
    expect(deleteBannerImageUseCase.execute).toHaveBeenCalledWith({
      id: payloadMock.id,
    });
  });
});
