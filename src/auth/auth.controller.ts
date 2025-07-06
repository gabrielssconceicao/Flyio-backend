import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { env } from '@/env';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from './cookie.constant';
import { SignInSwaggerDoc, RefreshTokenSwaggerDoc } from './swagger';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SignInSwaggerDoc()
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-in')
  async signIn(
    @Body() userLoginDto: UserLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signIn(userLoginDto);
    res.cookie(COOKIE_ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      maxAge: Number(env.JWT_ACCESS_TOKEN_EXPIRES_IN),
    });
    res.cookie(COOKIE_REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      maxAge: Number(env.JWT_REFRESH_TOKEN_EXPIRES_IN),
    });

    return { message: 'Login successful' };
  }

  @RefreshTokenSwaggerDoc()
  @HttpCode(HttpStatus.CREATED)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies[COOKIE_REFRESH_TOKEN] as string;

    const { newAccessToken } = await this.authService.refresh(token);
    res.cookie(COOKIE_ACCESS_TOKEN, newAccessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      maxAge: Number(env.JWT_ACCESS_TOKEN_EXPIRES_IN),
    });
  }
}
