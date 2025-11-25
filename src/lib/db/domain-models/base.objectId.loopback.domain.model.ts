import { Types } from 'mongoose';
import { z } from 'zod';
import {
  BaseLoopbackDomainModel,
  BaseLoopbackModel,
  IBaseLoopbackDomainModel,
} from '@/lib/db/domain-models/base.loopback.domain.model';
import { ensureObjectId } from '@lib/validation/validation.helpers';
import { filterUndefinedPropsOfDomainModel } from '../../helpers/object-helpers';

export const BaseObjectIdLoopbackModel = BaseLoopbackModel.extend({
  id: z.instanceof(Types.ObjectId),
}).strict();
type BaseObjectIdLoopbackModel = z.infer<typeof BaseObjectIdLoopbackModel>;

export type IBaseObjectIdLoopbackDomainModel = IBaseLoopbackDomainModel<
  Types.ObjectId
>;

export abstract class BaseObjectIdLoopbackDomainModel extends BaseLoopbackDomainModel<
  Types.ObjectId
> {
  constructor({ ...data }: IBaseObjectIdLoopbackDomainModel) {
    super(data, ensureObjectId);
  }
}

export interface IZodBaseObjectIdModel<
  Schema extends z.ZodType<BaseObjectIdLoopbackModel>
> extends BaseObjectIdLoopbackDomainModel {
  getRawData(): z.infer<Schema>;
}

export interface ZodBaseObjectIdDomainModelSchemaConstructor<
  Schema extends z.ZodType<BaseObjectIdLoopbackModel>
> {
  new (value: z.infer<Schema>): Readonly<z.infer<Schema>> &
    IZodBaseObjectIdModel<Schema>;
  schema: Schema;
}

export function getZodBaseObjectIdDomainModel<
  Schema extends typeof BaseObjectIdLoopbackModel
>(schema: Schema): ZodBaseObjectIdDomainModelSchemaConstructor<Schema> {
  const res = class extends BaseObjectIdLoopbackDomainModel
    implements IZodBaseObjectIdModel<Schema> {
    static schema = schema;
    constructor(value: z.infer<Schema>) {
      super(value);
      Object.assign(this, schema.readonly().parse(value));
    }

    static parse<T extends typeof res>(this: T, value: unknown): any {
      const parsed = new this(schema.parse(value)) as any;
      return parsed;
    }

    getRawData(): z.infer<Schema> {
      const filteredEntity = filterUndefinedPropsOfDomainModel(this);
      return schema.strip().parse(filteredEntity);
    }
  };

  return res as typeof res & any;
}
