import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

import { Email } from '../value-obj/email';
import { Username } from '../value-obj/username';

export type UserProps = {
  name: string;
  bio: string;
  username: Username;
  email: Email;
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
};

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id);
  }

  static create(props: Optional<UserProps, 'bio' | 'createdAt' | 'updatedAt' | 'isActive'>, id?: UniqueEntityId): User {
    return new User(
      {
        ...props,
        bio: props.bio ?? '',
        isActive: props.isActive ?? true,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      id,
    );
  }

  get name(): string {
    return this.props.name;
  }
  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get bio(): string {
    return this.props.bio;
  }

  set bio(bio: string) {
    this.props.bio = bio;
    this.touch();
  }

  get username(): Username {
    return this.props.username;
  }

  get email(): Email {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  set passwordHash(passwordHash: string) {
    this.props.passwordHash = passwordHash;
    this.touch();
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt;
  }

  activate() {
    this.props.isActive = true;
    this.touch();
  }

  deactivate() {
    this.props.isActive = false;
    this.touch();
  }
  private touch() {
    this.props.updatedAt = new Date();
  }
}
