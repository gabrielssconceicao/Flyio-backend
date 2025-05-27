import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingModule } from '@/hash/hashing.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './jwt.config';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    HashingModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
