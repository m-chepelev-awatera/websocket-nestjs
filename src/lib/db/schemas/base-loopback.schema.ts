import { Prop } from '@nestjs/mongoose';
import { Types, Schema as MSchema } from 'mongoose';

export abstract class BaseLoopbackSchema {
  @Prop({ type: Boolean, required: true, default: false })
  public readonly deleted: boolean;

  @Prop({ type: Date })
  public readonly modifiedDate: Date;

  @Prop({ type: MSchema.Types.ObjectId })
  public readonly modifiedBy: Types.ObjectId;

  @Prop({ type: String, required: false })
  public readonly changeStamp: string;
}
