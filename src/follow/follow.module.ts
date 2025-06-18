import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { FollowUseCasesProviders } from './use-cases';
@Module({
  controllers: [FollowController],
  providers: [...FollowUseCasesProviders, FollowService],
})
export class FollowModule {}
