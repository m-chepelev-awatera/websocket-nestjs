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
  id: z.custom<Types.ObjectId>().refine(val => Types.ObjectId.isValid(val)),
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
    this.id = this.ensureId({ id });
    this.createdAt = ensureValidDate({ createdAt });
    this.updatedAt = ensureValidDate({ updatedAt });
    this.changeStamp = ensureValidUuid({ changeStamp });
  }

  updateChangeStamp() {
    const mutableThis = this as MutableBaseDomainModelV2<TId>;
    mutableThis.changeStamp = v4();
    mutableThis.updatedAt = new Date(Date.now());
  }

  public abstract toString(): string;

  readonly id: TId;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly changeStamp: string;
}

type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

type MutableBaseDomainModelV2<TId> = Mutable<BaseDomainModel<TId>>;
