import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export type BaseTokenProps = {
  userId: UniqueEntityId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
};

export abstract class BaseToken<TProps extends BaseTokenProps> extends Entity<TProps> {
  get userId(): UniqueEntityId {
    return this.props.userId;
  }

  get token(): string {
    return this.props.token;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }
}
