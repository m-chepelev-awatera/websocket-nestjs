import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MSchema } from 'mongoose';

import { BaseObjectIdLoopbackSchema } from '@/lib/db/schemas/base-object-id-loopback.schema';

@Schema({ versionKey: false, collection: 'UserModel' })
export class UserSchemaDefinition extends BaseObjectIdLoopbackSchema {
  @Prop({ type: String, required: true })
  public readonly username: string;

  @Prop({ type: String, required: true })
  public readonly password: string;

  @Prop({ type: String, required: true })
  public readonly email: string;

  @Prop({ type: MSchema.Types.Array })
  public readonly groups: string[];

  @Prop({ type: MSchema.Types.ObjectId })
  public readonly principalId: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaDefinition);
