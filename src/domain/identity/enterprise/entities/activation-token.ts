import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

import { BaseToken, BaseTokenProps } from './base-token';

export class ActivationToken extends BaseToken<BaseTokenProps> {
  static create(props: Optional<BaseTokenProps, 'createdAt'>, id?: UniqueEntityId) {
    return new ActivationToken({ ...props, createdAt: props.createdAt ?? new Date() }, id);
  }
}
