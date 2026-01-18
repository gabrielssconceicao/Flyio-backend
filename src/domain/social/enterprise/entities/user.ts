import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

import { Email } from './value-obj/email';
import { Username } from './value-obj/username';

export interface UserProps {
  name: string;
  username: Username;
  bio: string;
  email: Email;
  password_hash: string;
  created_at: Date;
  is_active: boolean;
  followers_count: number;
  following_count: number;
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

  get bio(): string {
    return this.props.bio;
  }
  set bio(bio: string) {
    this.props.bio = bio;
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

  get is_active() {
    return this.props.is_active;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  get followers_count() {
    return this.props.followers_count;
  }

  get following_count() {
    return this.props.following_count;
  }

  deactivate() {
    this.props.is_active = false;
    this.touch();
  }
  activate() {
    this.props.is_active = true;
    this.touch();
  }

  private touch() {
    this.props.updated_at = new Date();
  }

  static create(
    props: Optional<
      UserProps,
      'created_at' | 'bio' | 'is_active' | 'followers_count' | 'following_count'
    >,
    id?: UniqueEntityId,
  ) {
    const user = new User(
      {
        ...props,
        bio: props.bio ?? '',
        created_at: props.created_at ?? new Date(),
        is_active: props.is_active ?? true,
        followers_count: props.followers_count ?? 0,
        following_count: props.following_count ?? 0,
      },
      id,
    );

    return user;
  }
}
