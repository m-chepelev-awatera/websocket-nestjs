import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  MessageDomainModel,
  ensureMessage,
} from '@chats/domain-models/message.domain-model';
import { MessageSchemaDefinition } from '@chats/db/schemas/message.schema';
import { MessageSchemaFactory } from '@chats/db/schema-factories/messages.schema-factory';
import { BaseObjectIdRepository } from '@/lib/db/repositories/base.object.id.repositiory';

@Injectable()
export class MessagesRepository extends BaseObjectIdRepository<
  MessageDomainModel,
  MessageSchemaDefinition
> {
  constructor(
    @InjectModel(MessageSchemaDefinition.name)
    protected model: Model<MessageSchemaDefinition>,
    protected schemaFactory: MessageSchemaFactory,
  ) {
    super(model, schemaFactory, ensureMessage);
  }

  async findConversationMessages(
    conversationId: Types.ObjectId,
  ): Promise<MessageDomainModel[]> {
    const result = await this.model
      .find({ conversationId })
      .sort({ createdAt: 1 })
      .exec();

    return this.toModels(result);
  }
}
