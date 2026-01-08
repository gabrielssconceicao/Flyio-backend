import { UniqueEntityId } from './unique-entity-id';

export abstract class Entity<Props> {
  private _id: UniqueEntityId;
  protected props: Props;
  get id() {
    return this._id;
  }
  protected constructor(props: any, _id?: UniqueEntityId) {
    this.props = props;
    this._id = _id ?? new UniqueEntityId();
  }
}
