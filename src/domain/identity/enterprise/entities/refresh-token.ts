import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export type RefreshTokenProps = {
  userId: UniqueEntityId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
};

export class RefreshToken extends Entity<RefreshTokenProps> {
  static create(props: Optional<RefreshTokenProps, 'createdAt'>, id?: UniqueEntityId) {
    return new RefreshToken({ ...props, createdAt: props.createdAt ?? new Date() }, id);
  }

  get userId(): UniqueEntityId {
    return this.props.userId;
  }

  get token(): string {
    return this.props.token;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  refresh({ expiresAt, token }: { expiresAt: Date; token: string }) {
    this.props.token = token;
    this.props.expiresAt = expiresAt;
  }
}
