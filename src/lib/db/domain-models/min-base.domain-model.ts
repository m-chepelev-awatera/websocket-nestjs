import z from 'zod';

import { Types } from 'mongoose';
import { ensureObjectId } from '@lib/validation/validation.helpers';
import { filterUndefinedPropsOfDomainModel } from '../../helpers/object-helpers';

export const MinModel = z
  .object({
    id: z.instanceof(Types.ObjectId),
  })
  .strict();
export type MinModel = z.infer<typeof MinModel>;

export interface IDomainModeWithCreateFromDatabase<T, K> {
  createFromDatabase(data: T): K;
}

export abstract class MinBaseDomainModel {
  protected constructor({ ...data }: MinModel) {
    this.id = data.id;
  }

  get id() {
    return this._id;
  }
  private set id(value: Types.ObjectId) {
    this._id = ensureObjectId({ id: value });
  }

  private _id: Types.ObjectId;
}

export interface IZodMinBaseModel<Schema extends z.ZodType<MinModel>>
  extends MinBaseDomainModel {
  getRawData(): z.infer<Schema>;
}

export interface ZodMinBaseDomainModelSchemaConstructor<
  Schema extends z.ZodType<MinModel>,
> {
  new (value: z.infer<Schema>): Readonly<z.infer<Schema>> &
    IZodMinBaseModel<Schema>;
  schema: Schema;
}

export function getZodMinBaseDomainModel<Schema extends typeof MinModel>(
  schema: Schema,
): ZodMinBaseDomainModelSchemaConstructor<Schema> {
  const res = class
    extends MinBaseDomainModel
    implements IZodMinBaseModel<Schema>
  {
    static schema = schema;
    constructor(value: z.infer<Schema>) {
      super({ id: value.id });
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
