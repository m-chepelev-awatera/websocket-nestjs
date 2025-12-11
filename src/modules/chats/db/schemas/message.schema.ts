import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MSchema, Types } from 'mongoose';

import { BaseEntityObjectIdSchema } from '@/lib/db/schemas/base-entity-object-id.schema';
import { MessageType } from '../../types';

@Schema({ _id: false })
export class AuthorSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  nameEn: string;

  @Prop({ type: MSchema.Types.ObjectId, required: true })
  userId: Types.ObjectId;
}

@Schema({ versionKey: false, collection: 'Message' })
export class MessageSchemaDefinition extends BaseEntityObjectIdSchema {
  @Prop({ type: MSchema.Types.ObjectId, required: true })
  public readonly conversationId: Types.ObjectId;

  @Prop({ type: String, required: true })
  public readonly type: MessageType;

  @Prop({ type: String, required: true })
  public readonly text: string;

  @Prop({ type: [Object], default: [] })
  public readonly files: Record<string, any>[];

  @Prop({ type: MSchema.Types.ObjectId, required: false })
  public readonly replyToId?: Types.ObjectId;

  @Prop({ type: AuthorSchema, required: false })
  public readonly author?: AuthorSchema;

  @Prop({ type: Boolean, required: false })
  public readonly edited?: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(
  MessageSchemaDefinition,
);
