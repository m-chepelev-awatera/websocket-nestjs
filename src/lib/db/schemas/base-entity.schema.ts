import { Prop } from '@nestjs/mongoose';

export abstract class BaseEntitySchema {
  @Prop({ type: String, required: true })
  public readonly changeStamp: string;

  @Prop({ type: Date, required: true })
  public readonly createdAt: Date;

  @Prop({ type: Date, required: true })
  public readonly updatedAt: Date;
}
