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
  password_hash: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date | null;
};

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id);
  }

  static create(
    props: Optional<UserProps, 'bio' | 'created_at' | 'updated_at' | 'is_active'>,
    id?: UniqueEntityId,
  ): User {
    return new User(
      {
        ...props,
        bio: props.bio ?? '',
        is_active: props.is_active ?? true,
        created_at: props.created_at ?? new Date(),
        updated_at: props.updated_at ?? null,
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

  get password_hash(): string {
    return this.props.password_hash;
  }

  set password_hash(password_hash: string) {
    this.props.password_hash = password_hash;
    this.touch();
  }

  get is_active(): boolean {
    return this.props.is_active;
  }

  get created_at(): Date {
    return this.props.created_at;
  }

  get updated_at(): Date | null {
    return this.props.updated_at;
  }

  activate() {
    this.props.is_active = true;
    this.touch();
  }

  deactivate() {
    this.props.is_active = false;
    this.touch();
  }
  private touch() {
    this.props.updated_at = new Date();
  }
}
