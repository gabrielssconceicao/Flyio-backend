import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { HashingModule } from '@/hash/hashing.module';
import jwtConfig from './jwt.config';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthUseCasesProviders } from './use-cases';
import { MailModule } from '@/mail/mail.module';
@Module({
  imports: [
    MailModule,
    HashingModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ...AuthUseCasesProviders],
  exports: [JwtModule],
})
export class AuthModule {}
