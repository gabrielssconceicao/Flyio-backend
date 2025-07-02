import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailUseCases } from './use-cases';

@Module({
  providers: [...MailUseCases, MailService],
  exports: [MailService],
})
export class MailModule {}
