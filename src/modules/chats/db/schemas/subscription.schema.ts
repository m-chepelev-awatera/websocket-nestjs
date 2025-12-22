import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MSchema } from 'mongoose';
import { BaseEntityObjectIdSchema } from '@/lib/db/schemas/base-entity-object-id.schema';

@Schema({ versionKey: false, collection: 'SubscriptionV2' })
export class SubscriptionSchemaDefinition extends BaseEntityObjectIdSchema {
  @Prop({ type: Date, required: false })
  public readonly lastRead?: Date;

  @Prop({ type: Boolean, required: false })
  public readonly hasUnreadTag?: boolean;

  @Prop({ type: Boolean, required: false })
  public readonly hasUnreadTeamTag?: boolean;

  @Prop({ type: MSchema.Types.Mixed, required: false })
  public readonly lastMessageText?: any;

  @Prop({ type: String, required: true })
  public readonly userId: string;

  @Prop({ type: String, required: true })
  public readonly conversationId: string;

  @Prop({ type: String, required: true })
  public readonly type: string;

  @Prop({ type: Boolean, required: true })
  public readonly isRead: boolean;

  @Prop({ type: Date, required: true })
  public readonly lastMessageDate: Date;

  @Prop({ type: Number, required: true })
  public readonly unreadMessagesCount: number;
}

export const SubscriptionSchema = SchemaFactory.createForClass(
  SubscriptionSchemaDefinition,
);
