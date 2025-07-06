import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

import { env } from '@/env';
import { ReactivationLinkTemplate } from './template/reactivate-account';
import { SendLinkUseCase, ReactivateAccountUseCase } from './use-cases';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(
    private readonly sendLink: SendLinkUseCase,
    private readonly reactivate: ReactivateAccountUseCase,
  ) {
    this.resend = new Resend(env.RESEND_API_KEY);
    this.resend.apiKeys.create({ name: 'Production' });
  }

  async sendReactivateLink({ email }: { email: string }): Promise<void> {
    const { authLinkId } = await this.sendLink.execute({ email });
    const authLink = new URL('/authenticate', env.API_BASE_URL);
    authLink.searchParams.set('code', authLinkId);

    await this.resend.emails.send({
      from: 'Flyio <onboarding@resend.dev>',
      to: email,
      subject: '[Flyio] Link para reativar a sua conta',
      react: ReactivationLinkTemplate({
        userEmail: email,
        reactivationLink: authLink.toString(),
      }),
    });
    console.log(authLink.toString());
    return;
  }

  async reactivateAccount({ code }: { code: string }) {
    return await this.reactivate.execute({ code });
  }
}
