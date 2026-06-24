import { ActivationToken } from '../../enterprise/entities/activation-token';

export abstract class ActivationTokenRepository {
  abstract create(activationToken: ActivationToken): Promise<void>;
}
