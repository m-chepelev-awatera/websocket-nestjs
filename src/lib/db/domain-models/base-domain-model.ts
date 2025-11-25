export interface IBaseEntity<TId> {
  id: TId;
}

export class BaseDomainModel<TId> {
  constructor({ ...data }: IBaseEntity<TId>) {
    this.id = data.id;
  }

  get id() {
    return this._id;
  }

  private set id(id: TId) {
    this._id = id;
  }

  private _id: TId;
}
