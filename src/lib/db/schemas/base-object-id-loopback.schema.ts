import { Prop } from '@nestjs/mongoose';
import { Schema as MSchema, Types } from 'mongoose';
import { BaseLoopbackSchema } from '@lib/db/schemas/base-loopback.schema';

export class BaseObjectIdLoopbackSchema extends BaseLoopbackSchema {
  @Prop({ type: MSchema.Types.ObjectId, required: true })
  public _id: Types.ObjectId;
}
