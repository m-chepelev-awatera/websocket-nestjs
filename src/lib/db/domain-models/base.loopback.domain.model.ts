import { v4 } from 'uuid';
import { Types } from 'mongoose';
import {
  EnsureCheck,
  ensureObjectId,
  ensureValidBool,
  ensureValidDate,
  ensureValidUuid,
  isNotRequired,
} from '@lib/validation/validation.helpers';
import { z } from 'zod';

export const BaseLoopbackModel = z
  .object({
    id: z.instanceof(Types.ObjectId),
    deleted: z.boolean(),
    modifiedDate: z.date().optional(),
    modifiedBy: z.instanceof(Types.ObjectId).optional(),
    changeStamp: z.string().optional(),
  })
  .strict();
export type BaseLoopbackModel = z.infer<typeof BaseLoopbackModel>;

export interface IBaseLoopbackDomainModel<TId> {
  id: TId;
  deleted: boolean;
  modifiedDate?: Date;
  modifiedBy?: Types.ObjectId;
  changeStamp?: string;
}

export interface IDomainModeWithCreateFromDatabase<T, K> {
  createFromDatabase(data: T): K;
}

export abstract class BaseLoopbackDomainModel<TId> {
  protected constructor(
    { ...data }: IBaseLoopbackDomainModel<TId>,
    protected ensureIdCheck: EnsureCheck<TId>,
  ) {
    this.id = data.id;
    this.deleted = data.deleted;
    this.modifiedDate =
      data.modifiedDate !== undefined ? data.modifiedDate : new Date();
    this.modifiedBy = data.modifiedBy;
    this._changeStamp = isNotRequired(ensureValidUuid, {
      changeStamp: data.changeStamp,
    });
  }

  get id(): TId {
    return this._id;
  }

  set id(value: TId) {
    this._id = this.ensureIdCheck({ id: value });
  }

  get deleted(): boolean {
    return this._deleted;
  }
  set deleted(value: boolean) {
    this._deleted = ensureValidBool({
      deleted: value !== undefined ? value : false,
    });
  }

  get modifiedDate() {
    return this._modifiedDate;
  }

  set modifiedDate(value: Date | undefined) {
    this._modifiedDate =
      value === undefined
        ? undefined
        : isNotRequired(ensureValidDate, {
            modifiedDate: value,
          });
  }

  get modifiedBy() {
    return this._modifiedBy;
  }

  set modifiedBy(value: Types.ObjectId | undefined) {
    this._modifiedBy =
      value === undefined
        ? undefined
        : isNotRequired(ensureObjectId, {
            modifiedBy: value,
          });
  }

  delete() {
    this._deleted = true;
  }

  get changeStamp() {
    return this._changeStamp;
  }

  set changeStamp(changeStamp: string | undefined) {
    this._changeStamp = isNotRequired(ensureValidUuid, {
      changeStamp,
    });
  }

  updateChangeStamp() {
    this._changeStamp = v4();
  }

  private _id: TId;
  private _deleted: boolean;
  private _modifiedDate?: Date;
  private _modifiedBy?: Types.ObjectId;
  private _changeStamp?: string;
}
