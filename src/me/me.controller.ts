import { Controller, Get, Patch, Delete } from '@nestjs/common';
import { MeService } from './me.service';

@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  find() {
    return 'get me';
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
