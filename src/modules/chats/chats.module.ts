import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsController } from '@chats/api/chats.controlles';
import { ChatsService } from '@chats/services/chats.service';
import { ConversationsRepository } from './db/repositories/conversations.repository';
import { MessagesRepository } from './db/repositories/messages.repository';
import { SubscriptionsRepository } from './db/repositories/subscriptions.repository';
import { UserModule } from '../users/user.module';
import { ConversationsSchemaFactory } from './db/schema-factories/conversations.schema-factory';
import { SubscriptionsSchemaFactory } from './db/schema-factories/subscriptions.schema-factory';
import { MessageSchemaFactory } from './db/schema-factories/messages.schema-factory';
import {
  ConversationSchema,
  ConversationSchemaDefinition,
} from './db/schemas/conversation.schema';
import {
  MessageSchema,
  MessageSchemaDefinition,
} from './db/schemas/message.schema';
import {
  SubscriptionSchema,
  SubscriptionSchemaDefinition,
} from './db/schemas/subscription.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: ConversationSchemaDefinition.name, schema: ConversationSchema },
      { name: MessageSchemaDefinition.name, schema: MessageSchema },
      { name: SubscriptionSchemaDefinition.name, schema: SubscriptionSchema },
    ]),
  ],
  controllers: [ChatsController],
  providers: [
    ChatsService,
    ConversationsRepository,
    MessagesRepository,
    SubscriptionsRepository,
    ConversationsSchemaFactory,
    SubscriptionsSchemaFactory,
    MessagesRepository,
    MessageSchemaFactory,
  ],
  exports: [ChatsService],
})
export class ChatsModule {}
