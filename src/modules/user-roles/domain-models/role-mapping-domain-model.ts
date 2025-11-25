import { Types } from 'mongoose';
import {
  ensureObjectId,
  ensureString,
} from '@/lib/validation/validation.helpers';

export interface IRoleMapping {
  id: Types.ObjectId;
  principalType: string;
  principalId: Types.ObjectId;
  roleId: Types.ObjectId;
}

export class RoleMappingDomainModel {
  private constructor({ ...data }: IRoleMapping) {
    this.id = data.id;
    this.principalType = data.principalType;
    this.principalId = data.principalId;
    this.roleId = data.roleId;
  }

  public static CreateFromDatabase(
    dataFromDb: IRoleMapping,
  ): RoleMappingDomainModel {
    return new RoleMappingDomainModel({ ...dataFromDb });
  }

  get id(): Types.ObjectId {
    return this._id;
  }
  private set id(value: Types.ObjectId) {
    this._id = ensureObjectId({ id: value });
  }

  get principalType(): string {
    return this._principalType;
  }
  private set principalType(value: string) {
    this._principalType = ensureString({ principalType: value });
  }

  get principalId(): Types.ObjectId {
    return this._principalId;
  }
  private set principalId(value: Types.ObjectId) {
    this._principalId = ensureObjectId({ id: value });
  }

  get roleId(): Types.ObjectId {
    return this._roleId;
  }
  private set roleId(value: Types.ObjectId) {
    this._roleId = ensureObjectId({ id: value });
  }

  private _id: Types.ObjectId;
  private _principalType: string;
  private _principalId: Types.ObjectId;
  private _roleId: Types.ObjectId;
}
