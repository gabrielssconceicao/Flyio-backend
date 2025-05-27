import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { COOKIE_ACCESS_TOKEN } from './cookie.contant';
import { env } from '@/env';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-in')
  async signIn(
    @Body() userLoginDto: UserLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signIn(userLoginDto);
    res.cookie(COOKIE_ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: Number(env.JWT_ACCESS_TOKEN_EXPIRES_IN),
    });

    return { message: 'Login successful' };
  }
}
