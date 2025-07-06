import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailUseCases } from './use-cases';
import { MailController } from './mail.controller';

@Module({
  providers: [...MailUseCases, MailService],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {}
