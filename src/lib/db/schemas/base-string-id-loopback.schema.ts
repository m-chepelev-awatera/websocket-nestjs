import { Prop } from '@nestjs/mongoose';
import { BaseLoopbackSchema } from '@lib/db/schemas/base-loopback.schema';

export class BaseStringIdLoopbackSchema extends BaseLoopbackSchema {
  @Prop({ type: String, required: true })
  public _id: string;
}
