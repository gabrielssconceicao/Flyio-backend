import { Injectable } from '@nestjs/common';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { CurrentUserEntity } from './entities/current-user.entity';

import {
  DeleteBannerImageUseCase,
  DeleteProfileImageUseCase,
  GetMeUseCase,
  UpdateMeUseCase,
} from './use-cases';
import { UpdateProfileImageAndMeParams } from './use-cases/types';
import { DesactivateMeUserCase } from './use-cases/desactivate-me.use-case';

@Injectable()
export class MeService {
  constructor(
    private readonly getMe: GetMeUseCase,
    private readonly updateMe: UpdateMeUseCase,
    private readonly desactivateMe: DesactivateMeUserCase,
    private readonly deleteProfileImg: DeleteProfileImageUseCase,
    private readonly deleteBanerImg: DeleteBannerImageUseCase,
  ) {}

  async get(payload: JwtPayload): Promise<{ user: CurrentUserEntity }> {
    return this.getMe.execute({ id: payload.id });
  }

  async update({
    payload,
    updateMeDto,
    bannerImage,
    profileImage,
  }: UpdateProfileImageAndMeParams): Promise<{ user: CurrentUserEntity }> {
    return this.updateMe.execute({
      payload,
      updateMeDto,
      bannerImage,
      profileImage,
    });
  }

  async desactivate(payload: JwtPayload) {
    return this.desactivateMe.execute({ id: payload.id });
  }

  async deleteProfileImage({
    payload,
  }: {
    payload: JwtPayload;
  }): Promise<void> {
    return this.deleteProfileImg.execute({ id: payload.id });
  }

  async deleteBannerImage({ payload }: { payload: JwtPayload }): Promise<void> {
    return this.deleteBanerImg.execute({ id: payload.id });
  }
}
