import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseObjectIdLoopbackSchema } from '@/lib/db/schemas/base-object-id-loopback.schema';

@Schema({ versionKey: false, collection: 'Conversation' })
export class ConversationSchemaDefinition extends BaseObjectIdLoopbackSchema {
  @Prop({ type: Boolean, required: false })
  public readonly archived?: boolean;

  @Prop({ type: String, required: false })
  public readonly pinnedMessageId?: string;

  @Prop({ type: Date, required: false })
  public readonly lastMessageSentDate?: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(
  ConversationSchemaDefinition,
);
