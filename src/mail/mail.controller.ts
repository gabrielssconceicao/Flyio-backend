import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { ReactivateAccountSwaggerDoc, SendLinkSwaggerDoc } from './swagger';
import { SendLinkDto } from './dto/send-link.dto';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @SendLinkSwaggerDoc()
  @HttpCode(HttpStatus.CREATED)
  @Post('/send-link')
  async sendLink(@Body() body: SendLinkDto) {
    return this.mailService.sendReactivateLink({ email: body.email });
  }

  @ReactivateAccountSwaggerDoc()
  @HttpCode(HttpStatus.OK)
  @Get('/authenticate')
  async reactivateAccount(@Query() query: { code: string }) {
    await this.mailService.reactivateAccount({ code: query.code });
  }
}
