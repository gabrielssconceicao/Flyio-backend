export type MailSenderProps = {
  to: string;
  subject: string;
  body: string;
};

export abstract class MailSender {
  abstract send(data: MailSenderProps): Promise<void>;
}
