import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

import { env } from '@/env';
import { ReactivationLinkTemplate } from './template/reactivate-account';
import { SendLinkUseCase } from './use-cases';
import { link } from 'fs';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(private readonly sendLink: SendLinkUseCase) {
    this.resend = new Resend(env.RESEND_API_KEY);
    this.resend.apiKeys.create({ name: 'Production' });
  }

  async sendReactivateLink({ email }: { email: string }): Promise<void> {
    const { authLinkId } = await this.sendLink.execute({ email });
    const authLink = new URL('/auth-links/authenticate', env.API_BASE_URL);
    authLink.searchParams.set('code', authLinkId);
    authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL);

    await this.resend.emails.send({
      from: 'Flyio <onboarding@resend.dev>',
      to: email,
      subject: '[Pizza Shop] Link para reativar a sua conta',
      react: ReactivationLinkTemplate({
        userEmail: email,
        reactivationLink: authLink.toString(),
      }),
    });
    console.log(authLink.toString());
    return;
  }
}
