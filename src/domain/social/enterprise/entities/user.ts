import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

import { Email } from './value-obj/email';
import { Username } from './value-obj/username';

export interface UserProps {
  name: string;
  username: Username;
  email: Email;
  password_hash: string;
  created_at: Date;
  updated_at?: Date;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }
  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get username() {
    return this.props.username;
  }
  set username(username: Username) {
    this.props.username = username;
    this.touch();
  }

  get email() {
    return this.props.email;
  }
  set email(email: Email) {
    this.props.email = email;
    this.touch();
  }

  get password_hash() {
    return this.props.password_hash;
  }
  set password_hash(password_hash: string) {
    this.props.password_hash = password_hash;
    this.touch();
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  private touch() {
    this.props.updated_at = new Date();
  }

  static create(props: Optional<UserProps, 'created_at'>, id?: UniqueEntityId) {
    const user = new User(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id,
    );

    return user;
  }
}
