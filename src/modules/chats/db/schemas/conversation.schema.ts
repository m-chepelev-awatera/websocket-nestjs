import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntityObjectIdSchema } from '@/lib/db/schemas/base-entity-object-id.schema';

@Schema({ versionKey: false, collection: 'ConversationV2' })
export class ConversationSchemaDefinition extends BaseEntityObjectIdSchema {
  @Prop({ type: Boolean, required: true })
  public readonly archived: boolean;

  @Prop({ type: String, required: true })
  public readonly title: string;

  @Prop({ type: String, required: false })
  public readonly pinnedMessageId?: string;
}

export const ConversationSchema = SchemaFactory.createForClass(
  ConversationSchemaDefinition,
);
