import { UserRepository } from '@/modules/users/db/repositories/user-repository';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateConversationDto } from '../api/dto/create-conversation.dto';
import { ConversationsRepository } from '../db/repositories/conversations.repository';
import { MessagesRepository } from '../db/repositories/messages.repository';
import { SubscriptionsRepository } from '../db/repositories/subscriptions.repository';
import { ConversationDomainModel } from '../domain-models/conversation.domain-model';
import { MessageDomainModel } from '../domain-models/message.domain-model';
import { SubscriptionDomainModel } from '../domain-models/subscription.domain-model';
import {
  CreateMessageSchema,
  NewMessageForSubSchema,
} from '../schemas/message.schema';
import { SubscribeUserToConversation } from '../schemas/subscribe-user.schema';
import { UnsubscribeUserFromConversation } from '../schemas/unsubscribe-user.schema';
import { ResponseMessageDto } from '../api/dto/response-message.dto';

@Injectable()
export class ChatsService {
  constructor(
    private readonly conversationsRepository: ConversationsRepository,
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly messsagesRepository: MessagesRepository,
    private readonly usersRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
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

  async updateSubsWithLastMessage(message: MessageDomainModel) {
    const subscriptions = await this.subscriptionsRepository.findAllConversationSubs(
      message.conversationId,
    );

    for (const sub of subscriptions) {
      const newMessageDataForSubUpdate = NewMessageForSubSchema.parse(message);
      sub.processNewMessage(newMessageDataForSubUpdate);
      await this.subscriptionsRepository.update(sub);
    }
  }

  async createAndSaveMessage(data: CreateMessageSchema) {
    await this.conversationsRepository.getById(data.conversationId);
    const message = MessageDomainModel.Create(data);

    const createdMessage = await this.messsagesRepository.createOne(message);
    return new ResponseMessageDto(createdMessage);
  }

  async sendMessage(data: CreateMessageSchema) {
    const message = await this.createAndSaveMessage(data);
    this.eventEmitter.emit('message.created', message);
    return message;
  }

  async getConversationWithMessages(
    conversationId: Types.ObjectId,
  ): Promise<{
    conversation: ConversationDomainModel;
    messages: MessageDomainModel[];
  }> {
    const conversation = await this.conversationsRepository.getById(
      conversationId,
    );

    const messages = await this.messsagesRepository.findConversationMessages(
      conversationId,
    );

    return { conversation, messages };
  }
}
