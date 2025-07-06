import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { MailService } from './mail.service';
import { Response } from 'express';

type QueryParam = {
  redirect: string;
  code: string;
};

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/send-link')
  async sendLink(@Body('email') email: string) {
    return this.mailService.sendReactivateLink({ email });
  }

  @Get('/auth-links/authenticate')
  async reactivateAccount(@Query() query: QueryParam, @Res() res: Response) {
    const { code, redirect } = query;
    await this.mailService.reactivateAccount({ code });
    // res.redirect(redirect);
  }
}
