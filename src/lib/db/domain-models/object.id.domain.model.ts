import { Types } from 'mongoose';
import { z } from 'zod';
import { ensureObjectId } from '@lib/validation/validation.helpers';
import {
  BaseDomainModel,
  BaseModel,
  IBaseDomainModel,
} from '@/lib/db/domain-models/base.domain.model';

export const BaseObjectIdModel = BaseModel.extend({
  id: z.instanceof(Types.ObjectId),
});
export type BaseObjectIdModel = z.infer<typeof BaseObjectIdModel>;

export interface IObjectIdDomainModel {
  id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  changeStamp: string;
}

export abstract class ObjectIdDomainModel extends BaseDomainModel<Types.ObjectId> {
  protected constructor({
    id,
    createdAt,
    updatedAt,
    changeStamp,
  }: IBaseDomainModel<Types.ObjectId>) {
    super({ id, createdAt, updatedAt, changeStamp }, ensureObjectId);
  }
}

export interface ZodBaseObjectIdModelSchemaConstructor<
  Schema extends z.ZodType<BaseObjectIdModel>,
> {
  new (value: z.infer<Schema>): Readonly<z.infer<Schema>> & ObjectIdDomainModel;
  schema: Schema;
}

export function getZodBaseObjectIdDomainModel<
  Schema extends z.ZodType<BaseObjectIdModel>,
>(schema: Schema): ZodBaseObjectIdModelSchemaConstructor<Schema> {
  const res = class extends ObjectIdDomainModel {
    static schema = schema;
    constructor(value: z.infer<Schema>) {
      super({
        id: value.id,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt,
        changeStamp: value.changeStamp,
      });

      Object.assign(this, schema.readonly().parse(value));
    }

    static parse<T extends typeof res>(this: T, value: unknown): any {
      const parsed = new this(schema.parse(value)) as any;
      return parsed;
    }

    public toString(): string {
      return this.id.toString();
    }
  };

  return res as typeof res & any;
}
