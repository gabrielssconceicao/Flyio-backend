import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { LikesUseCasesProviders } from './use-cases';

@Module({
  controllers: [LikesController],
  providers: [...LikesUseCasesProviders, LikesService],
})
export class LikesModule {}
