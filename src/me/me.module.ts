import { Module } from '@nestjs/common';
import { HashingModule } from '@/hash/hashing.module';
import { MeService } from './me.service';
import { MeController } from './me.controller';

@Module({
  imports: [HashingModule],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
