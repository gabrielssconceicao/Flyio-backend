import { Controller, Get, Patch, Delete, UseGuards } from '@nestjs/common';
import { MeService } from './me.service';

import { JwtAuthGuard } from '@/common/guard/jwt-auth.guard';
import { CurrentUser } from '@/common/params/current-user.params';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';

@UseGuards(JwtAuthGuard)
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  getMe(@CurrentUser() user: JwtPayload) {
    return { user };
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
