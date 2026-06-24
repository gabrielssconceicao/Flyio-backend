import { Either, left, right } from '@/core/either/either';
import { ValidationError } from '@/core/errors/validation-error';
import { ActivationToken } from '@/domain/identity/enterprise/entities/activation-token';
import { Email } from '@/domain/identity/enterprise/value-obj/email';

import { MailSender } from '../../mail/mail-sender';
import { ActivationTokenRepository } from '../../repository/activation-token-repository';
import { UsersRepository } from '../../repository/users-repository';
import { CodeGenerator } from '../../service/code-generator';

type SendActivateCodeRequest = {
  email: string;
};

type SendActivateCodeResponse = Either<ValidationError, void>;

export class SendActivateCodeUseCase {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly activationTokenRepository: ActivationTokenRepository,
    private readonly mailSender: MailSender,
    private readonly codeGenerator: CodeGenerator,
  ) {}
  async handle({ email }: SendActivateCodeRequest): Promise<SendActivateCodeResponse> {
    const emailOrError = Email.create(email);

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    const user = await this.userRepository.findByEmail(emailOrError.value);

    if (!user) {
      return right(undefined);
    }

    // create activation code
    const code = await this.codeGenerator.generate();
    await this.activationTokenRepository.create(
      ActivationToken.create({ userId: user.id, token: code, expiresAt: new Date(Date.now() + 1000 * 60 * 15) }),
    );

    await this.mailSender.send({
      to: email,
      subject: 'Activate your account',
      body: `Your activation code is ${code}`,
    });

    return right(undefined);
  }
}
