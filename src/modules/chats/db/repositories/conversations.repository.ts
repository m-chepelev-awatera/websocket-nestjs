import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ConversationDomainModel,
  ensureConversation,
} from '@chats/domain-models/conversation.domain-model';
import { ConversationSchemaDefinition } from '@chats/db/schemas/conversation.schema';
import { ConversationsSchemaFactory } from '@chats/db/schema-factories/conversations.schema-factory';
import { BaseObjectIdRepository } from '@/lib/db/repositories/base.object.id.repositiory';

@Injectable()
export class ConversationsRepository extends BaseObjectIdRepository<
  ConversationDomainModel,
  ConversationSchemaDefinition
> {
  constructor(
    @InjectModel(ConversationSchemaDefinition.name)
    protected model: Model<ConversationSchemaDefinition>,
    protected schemaFactory: ConversationsSchemaFactory,
  ) {
    super(model, schemaFactory, ensureConversation);
  }
}
