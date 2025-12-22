import { z } from 'zod';
import {
  BaseLoopbackDomainModel,
  BaseLoopbackModel,
  IBaseLoopbackDomainModel,
} from '@/lib/domain-models/base.loopback.domain.model';
import { ensureString } from '@lib/validation/validation.helpers';
import { filterUndefinedPropsOfDomainModel } from '../helpers/object-helpers';

export const BaseStringIdLoopbackModel = BaseLoopbackModel.extend({
  id: z.string(),
}).strict();
export type BaseStringIdLoopbackModel = z.infer<
  typeof BaseStringIdLoopbackModel
>;

export type IBaseStringIdLoopbackDomainModel = IBaseLoopbackDomainModel<string>;

export abstract class BaseStringIdLoopbackDomainModel extends BaseLoopbackDomainModel<string> {
  constructor({ ...data }: IBaseStringIdLoopbackDomainModel) {
    super(data, ensureString);
  }
}

export interface IZodBaseStringIdModel<
  Schema extends z.ZodType<BaseStringIdLoopbackModel>,
> extends BaseStringIdLoopbackDomainModel {
  getRawData(): z.infer<Schema>;
}

export interface ZodBaseStringIdDomainModelSchemaConstructor<
  Schema extends z.ZodType<BaseStringIdLoopbackModel>,
> {
  new (value: z.infer<Schema>): Readonly<z.infer<Schema>> &
    IZodBaseStringIdModel<Schema>;
  schema: Schema;
}

export function getZodBaseStringIdDomainModel<
  Schema extends typeof BaseStringIdLoopbackModel,
>(schema: Schema): ZodBaseStringIdDomainModelSchemaConstructor<Schema> {
  const res = class extends BaseStringIdLoopbackDomainModel {
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
