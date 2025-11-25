import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MSchema } from 'mongoose';

@Schema({ versionKey: false, collection: 'AccessToken' })
export class AccessTokenSchemaDefinition {
  @Prop({ type: String, required: true })
  public readonly _id: string;

  @Prop({ type: Number, required: true })
  public readonly ttl: number;

  @Prop({ type: Date, required: true })
  public readonly created: Date;

  @Prop({ type: MSchema.Types.ObjectId, required: true })
  public readonly userId: Types.ObjectId;
}

export const AccessTokenSchema = SchemaFactory.createForClass(
  AccessTokenSchemaDefinition,
);
