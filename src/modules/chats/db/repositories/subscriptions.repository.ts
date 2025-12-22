import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  SubscriptionDomainModel,
  ensureSubscription,
} from '@chats/domain-models/subscription.domain-model';
import { SubscriptionSchemaDefinition } from '@chats/db/schemas/subscription.schema';
import { SubscriptionsSchemaFactory } from '@chats/db/schema-factories/subscriptions.schema-factory';
import { BaseObjectIdRepository } from '@/lib/db/repositories/base.object.id.repositiory';
import { SubscribeUserToConversation } from '../../schemas/subscribe-user.schema';

@Injectable()
export class SubscriptionsRepository extends BaseObjectIdRepository<
  SubscriptionDomainModel,
  SubscriptionSchemaDefinition
> {
  constructor(
    @InjectModel(SubscriptionSchemaDefinition.name)
    protected model: Model<SubscriptionSchemaDefinition>,
    protected schemaFactory: SubscriptionsSchemaFactory,
  ) {
    super(model, schemaFactory, ensureSubscription);
  }

  async findByConversationIdAndUserId(
    data: SubscribeUserToConversation,
  ): Promise<SubscriptionDomainModel | null> {
    const result = await this.model.findOne({
      conversationId: data.conversationId,
      userId: data.userId,
    });

    if (!result) return null;

    return this.toModel(result);
  }

  async findAllConversationSubs(
    conversationId: Types.ObjectId,
  ): Promise<SubscriptionDomainModel[]> {
    const result = await this.model
      .find({ conversationId })
      .sort({ createdAt: 1 })
      .exec();

    return this.toModels(result);
  }
}
