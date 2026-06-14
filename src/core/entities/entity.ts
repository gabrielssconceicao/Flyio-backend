import { UniqueEntityId } from './unique-entity-id';

export abstract class Entity<Props> {
  private readonly _id: UniqueEntityId;
  protected props: Props;

  get id(): UniqueEntityId {
    return this._id;
  }
  equals(entity?: Entity<unknown>): boolean {
    if (!entity) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    return this.id.equals(entity.id);
  }

  protected constructor(props: Props, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId();
    this.props = props;
  }
}
