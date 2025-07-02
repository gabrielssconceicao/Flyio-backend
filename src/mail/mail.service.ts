import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

import { env } from '@/env';
import { ReactivationLinkTemplate } from './template/reactivate-account';

interface ReactivationParams {
  email: string;
  link: string;
}
@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
    this.resend.apiKeys.create({ name: 'Production' });
  }

  async sendReactivateUserLink({ email, link }: ReactivationParams) {
    const { data, error } = await this.resend.emails.send({
      from: 'Flyio <no-reply@flyio.com>',
      to: email,
      subject: '[Pizza Shop] Link para reativar a sua conta',
      react: ReactivationLinkTemplate({
        userEmail: email,
        reactivationLink: link,
      }),
    });
    if (error) {
      console.log(error);
    }
    console.log(data);
  }
}
