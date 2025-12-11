import { UserRepository } from '@/modules/users/db/repositories/user-repository';
import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from '../api/dto/create-conversation.dto';
import { ConversationsRepository } from '../db/repositories/conversations.repository';
import { MessagesRepository } from '../db/repositories/messages.repository';
import { SubscriptionsRepository } from '../db/repositories/subscriptions.repository';
import { ConversationDomainModel } from '../domain-models/conversation.domain-model';
import { MessageDomainModel } from '../domain-models/message.domain-model';
import { SubscriptionDomainModel } from '../domain-models/subscription.domain-model';
import { CreateMessageSchema } from '../schemas/message.schema';
import { SubscribeUserToConversation } from '../schemas/subscribe-user.schema';
import { UnsubscribeUserFromConversation } from '../schemas/unsubscribe-user.schema';

@Injectable()
export class ChatsService {
  constructor(
    private readonly conversationsRepository: ConversationsRepository,
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly messsagesRepository: MessagesRepository,
    private readonly usersRepository: UserRepository,
  ) {}

  async createConversation(
    data: CreateConversationDto,
  ): Promise<ConversationDomainModel> {
    const conversation = ConversationDomainModel.Create(data.title);
    return this.conversationsRepository.createOne(conversation);
  }

  async subscribeToConversation(
    data: SubscribeUserToConversation,
  ): Promise<SubscriptionDomainModel> {
    // Verify conversation and user exist
    await this.conversationsRepository.getById(data.conversationId);
    await this.usersRepository.getById(data.userId);

    const subscription = SubscriptionDomainModel.Create(data);

    return this.subscriptionsRepository.createOne(subscription);
  }

  async unsubscribeFromConversation(
    data: UnsubscribeUserFromConversation,
  ): Promise<void> {
    // Verify subscription exists
    await this.subscriptionsRepository.getById(data.subscriptionId);
    await this.conversationsRepository.getById(data.conversationId);
    await this.usersRepository.getById(data.userId);

    await this.subscriptionsRepository.deleteById(data.subscriptionId);
  }

  async getMySubscription(
    data: SubscribeUserToConversation,
  ): Promise<SubscriptionDomainModel | null> {
    // Verify conversation and user exist
    await this.conversationsRepository.getById(data.conversationId);
    await this.usersRepository.getById(data.userId);

    return this.subscriptionsRepository.findByConversationIdAndUserId(data);
  }

  async sendMessage(data: CreateMessageSchema) {
    const message = MessageDomainModel.Create(data);
    return this.messsagesRepository.createOne(message);
  }
}
