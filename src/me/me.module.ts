import { Module } from '@nestjs/common';
import { HashingModule } from '@/hash/hashing.module';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { ImageStoreModule } from '@/image-store/image-store.module';

@Module({
  imports: [HashingModule, ImageStoreModule],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
