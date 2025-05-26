import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() userLoginDto: UserLoginDto) {
    return this.authService.signIn(userLoginDto);
  }
}
