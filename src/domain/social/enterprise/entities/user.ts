import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface UserProps {
  name: string;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at?: Date;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  get username() {
    return this.props.username;
  }

  get email() {
    return this.props.email;
  }

  get password_hash() {
    return this.props.password_hash;
  }

  set name(name: string) {
    this.props.name = name;
    this.thouch();
  }

  set username(username: string) {
    this.props.username = username;
    this.thouch();
  }

  set email(email: string) {
    this.props.email = email;
    this.thouch();
  }

  set password_hash(passwordHash: string) {
    this.props.password_hash = passwordHash;
    this.thouch();
  }

  private thouch() {
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
