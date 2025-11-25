import { Prop } from '@nestjs/mongoose';
import { Schema as MSchema, Types } from 'mongoose';
import { BaseEntitySchema } from './base-entity.schema';

export abstract class BaseEntityObjectIdSchema extends BaseEntitySchema {
  @Prop({ type: MSchema.Types.ObjectId, required: true })
  public readonly _id: Types.ObjectId;
}
