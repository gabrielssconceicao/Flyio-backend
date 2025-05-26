import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingModule } from '@/hash/hashing.module';
@Module({
  imports: [HashingModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
