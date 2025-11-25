import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ConversationDomainModel,
  ensureConversation,
} from '@/modules/conversations/domain-models/conversation-domain-model';
import { ConversationSchemaDefinition } from '@/modules/conversations/db/schemas/conversation-schema';
import { ConversationSchemaFactory } from '@/modules/conversations/db/schema-factories/conversation-schema-factory';
import { BaseObjectIdLoopbackRepository } from '@/lib/db/repositories/loopback/base-object-id-loopback-repository';

@Injectable()
export class ConversationRepository extends BaseObjectIdLoopbackRepository<
  ConversationDomainModel,
  ConversationSchemaDefinition
> {
  constructor(
    @InjectModel(ConversationSchemaDefinition.name)
    protected model: Model<ConversationSchemaDefinition>,
    protected schemaFactory: ConversationSchemaFactory,
  ) {
    super(model, schemaFactory, ensureConversation);
  }
}
