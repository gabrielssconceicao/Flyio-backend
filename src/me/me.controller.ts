import { Controller, Get, Patch, Delete } from '@nestjs/common';
import { MeService } from './me.service';
import { CookieTokenParam } from '@/common/params/cookie-token.params';

@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  getMe(@CookieTokenParam() token: string) {
    return { token };
  }

  @Patch()
  update() {
    return 'update me';
  }

  @Delete()
  remove() {
    return 'delete me';
  }
}
