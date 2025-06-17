import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { HashingModule } from '@/hash/hashing.module';
import jwtConfig from './jwt.config';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshTokenUseCase, SignInUseCase } from './use-cases';
@Module({
  imports: [
    HashingModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenUseCase, SignInUseCase],
  exports: [JwtModule],
})
export class AuthModule {}
