import {
  EnsureCheck,
  ensureValidDate,
  ensureValidUuid,
  notNull,
} from '@lib/validation/validation.helpers';
import { Types } from 'mongoose';
import { v4 } from 'uuid';
import { z } from 'zod';

export const BaseModel = z.object({
  id: z.custom<Types.ObjectId>().refine((val) => Types.ObjectId.isValid(val)),
  createdAt: z.date(),
  updatedAt: z.date(),
  changeStamp: z.string(),
});
export type BaseModel = z.infer<typeof BaseModel>;

export interface IBaseDomainModel<TId> {
  id: TId;
  createdAt: Date;
  updatedAt: Date;
  changeStamp: string;
}

export abstract class BaseDomainModel<TId> {
  protected constructor(
    { id, createdAt, updatedAt, changeStamp }: IBaseDomainModel<TId>,
    protected ensureId: EnsureCheck<TId>,
  ) {
    notNull({ ensureId });
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.changeStamp = changeStamp;
  }

  get id(): TId {
    return this._id;
  }

  set id(value: TId) {
    this._id = this.ensureId({ id: value });
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(value: Date) {
    this._createdAt = ensureValidDate({ createdAt: value });
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(value: Date) {
    this._updatedAt = ensureValidDate({ updatedAt: value });
  }

  get changeStamp(): string {
    return this._changeStamp;
  }

  set changeStamp(value: string) {
    this._changeStamp = ensureValidUuid({ changeStamp: value });
  }

  updateChangeStamp() {
    this._changeStamp = v4();
    this._updatedAt = new Date(Date.now());
  }

  public abstract toString(): string;

  private _id: TId;

  private _createdAt: Date;

  private _updatedAt: Date;

  private _changeStamp: string;
}
