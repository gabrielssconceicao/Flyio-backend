import { MeUseCase } from './me.use-case';
import { GetMeUseCase } from './get-me.use-case';
import { UpdateMeUseCase } from './update-me.use-case';
import { DesactivateMeUserCase } from './desactivate-me.use-case';
import { DeleteProfileImageUseCase } from './delete-profile-image.use-case';
import { DeleteBannerImageUseCase } from './delete-banner-image.use-case';

export const MeUseCasesProviders = [
  GetMeUseCase,
  UpdateMeUseCase,
  DesactivateMeUserCase,
  DeleteProfileImageUseCase,
  DeleteBannerImageUseCase,
  MeUseCase,
];
export {
  GetMeUseCase,
  UpdateMeUseCase,
  DesactivateMeUserCase,
  DeleteProfileImageUseCase,
  DeleteBannerImageUseCase,
};
