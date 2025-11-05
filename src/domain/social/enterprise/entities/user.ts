import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface UserProps {
  name: string;
  username: string;
  email: string;
  password_hash: string;
  followersCount: number;
  followingCount: number;
  isActive: boolean;
  deactivatedAt: Date | null;
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

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  get isActive() {
    return this.props.isActive;
  }

  get deactivatedAt() {
    return this.props.deactivatedAt;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  set username(username: string) {
    this.props.username = username;
    this.touch();
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  set password_hash(passwordHash: string) {
    this.props.password_hash = passwordHash;
    this.touch();
  }

  private touch() {
    this.props.updated_at = new Date();
  }

  private increaseFollowersCount() {
    this.props.followersCount++;
  }

  private decreaseFollowersCount() {
    this.props.followersCount--;
  }

  private increaseFollowingCount() {
    this.props.followingCount++;
  }

  private decreaseFollowingCount() {
    this.props.followingCount--;
  }

  deactivate() {
    this.props.isActive = false;
    this.props.deactivatedAt = new Date();
    this.touch();
  }

  activate() {
    this.props.isActive = true;
    this.props.deactivatedAt = null;
    this.touch();
  }

  follow(user: User) {
    this.increaseFollowingCount();
    user.increaseFollowersCount();
  }
  unfollow(user: User) {
    this.decreaseFollowingCount();
    user.decreaseFollowersCount();
  }

  static create(
    props: Optional<
      UserProps,
      'created_at' | 'isActive' | 'followersCount' | 'followingCount'
    >,
    id?: UniqueEntityId,
  ) {
    const user = new User(
      {
        ...props,
        isActive: props.isActive ?? true,
        created_at: props.created_at ?? new Date(),
        updated_at: props.updated_at ?? null,
        deactivatedAt: props.deactivatedAt ?? null,
        followersCount: props.followersCount ?? 0,
        followingCount: props.followingCount ?? 0,
      },
      id,
    );

    return user;
  }
}
