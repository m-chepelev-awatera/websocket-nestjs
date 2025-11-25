import { Types } from 'mongoose';

import {
  ensureEnumValue,
  ensureObjectId,
  ensureValidBool,
  ensureValidDate,
} from '@/lib/validation/validation.helpers';
import { UserRoles } from '@user-roles/types';

export interface IRole {
  id: Types.ObjectId;
  name: UserRoles;
  created: Date;
  modified: Date;
  deleted: boolean;
}

export class RoleDomainModel {
  private constructor({ ...data }: IRole) {
    this.id = data.id;
    this.name = data.name;
    this.created = data.created;
    this.modified = data.modified;
    this.deleted = data.deleted;
  }

  public static CreateFromDatabase(dataFromDb: IRole): RoleDomainModel {
    return new RoleDomainModel({ ...dataFromDb });
  }

  get id(): Types.ObjectId {
    return this._id;
  }
  private set id(value: Types.ObjectId) {
    this._id = ensureObjectId({ id: value });
  }

  get name() {
    return this._name;
  }
  private set name(value: UserRoles) {
    this._name = ensureEnumValue(UserRoles, { name: value });
  }

  get created(): Date {
    return this._created;
  }
  private set created(value: Date) {
    this._created = ensureValidDate({ date: value });
  }

  get modified(): Date {
    return this._modified;
  }
  private set modified(value: Date) {
    this._modified = ensureValidDate({ date: value });
  }

  get deleted(): boolean {
    return this._deleted;
  }
  private set deleted(value: boolean) {
    this._deleted = ensureValidBool({ deleted: value });
  }

  private _id: Types.ObjectId;
  private _name: UserRoles;
  private _created: Date;
  private _modified: Date;
  private _deleted: boolean;
}
