import { Module } from '@nestjs/common';
import { HashingModule } from '@/hash/hashing.module';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { ImageStoreModule } from '@/image-store/image-store.module';
import {
  DesactivateMeUserCase,
  GetMeUseCase,
  UpdateMeUseCase,
  DeleteBannerImageUseCase,
  DeleteProfileImageUseCase,
} from './use-cases';
@Module({
  imports: [HashingModule, ImageStoreModule],
  controllers: [MeController],
  providers: [
    GetMeUseCase,
    UpdateMeUseCase,
    DesactivateMeUserCase,
    DeleteBannerImageUseCase,
    DeleteProfileImageUseCase,
    MeService,
  ],
})
export class MeModule {}
