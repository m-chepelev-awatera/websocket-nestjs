import { Prop } from '@nestjs/mongoose';
import { Types, Schema as MSchema } from 'mongoose';

export abstract class MinBaseLoopbackSchema {
  @Prop({ type: MSchema.Types.ObjectId, required: true })
  public readonly _id: Types.ObjectId;
}
