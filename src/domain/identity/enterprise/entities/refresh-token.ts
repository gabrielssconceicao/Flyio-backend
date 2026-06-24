import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

import { BaseToken, BaseTokenProps } from './base-token';

export class RefreshToken extends BaseToken<BaseTokenProps> {
  static create(props: Optional<BaseTokenProps, 'createdAt'>, id?: UniqueEntityId) {
    return new RefreshToken({ ...props, createdAt: props.createdAt ?? new Date() }, id);
  }

  refresh({ expiresAt, token }: { expiresAt: Date; token: string }) {
    this.props.token = token;
    this.props.expiresAt = expiresAt;
  }
}
