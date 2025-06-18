import { Module } from '@nestjs/common';
import { HashingModule } from '@/hash/hashing.module';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { ImageStoreModule } from '@/image-store/image-store.module';
import { MeUseCasesProviders } from './use-cases';
@Module({
  imports: [HashingModule, ImageStoreModule],
  controllers: [MeController],
  providers: [...MeUseCasesProviders, MeService],
})
export class MeModule {}
