import { UseInterceptors } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RedisPropagatorInterceptor } from '@app/shared/redis-propagator/redis-propagator.interceptor';
import { ChatsService } from '@/modules/chats/services/chats.service';
import { Server, Socket } from 'socket.io';
import {
  HandshakeWithAuth,
  WsAuthMiddleware,
} from '@/lib/middlewares/ws-auth-middleware';
import { AccessTokenRepository } from '@/modules/users/db/repositories/access-token-repository';
import { ArgumentError } from '@/lib/errors/argument.error';
import { Types } from 'mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import { SendMessageDto } from '@/modules/chats/api/dto/send-message.dto';
import { CreateMessageSchema } from '@/modules/chats/schemas/message.schema';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly accessTokenRepository: AccessTokenRepository,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(): void {
    this.server.use(WsAuthMiddleware(this.accessTokenRepository));
  }

  async handleConnection(client: Socket): Promise<void> {
    const conversationId = (client.handshake as HandshakeWithAuth).auth
      .conversationId;

    try {
      if (!conversationId) throw new ArgumentError('No conversation to join');
      const conversationIdConverted = new Types.ObjectId(conversationId);
      const conversationWithMessages = await this.chatsService.getConversationWithMessages(
        conversationIdConverted,
      );

      client.join(conversationId.toString());
      client.emit('conversation-with-messages', conversationWithMessages);
    } catch (error) {
      console.error('Socket connection error:', error);
      client.emit('connection-error', {
        message: (error as Error).message ?? 'Unexpected error',
      });
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const conversationId = (client.handshake as HandshakeWithAuth).auth
      .conversationId;

    if (!conversationId) throw new ArgumentError('No conversation to leave');

    await client.leave(conversationId.toString());
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessageDto,
  ) {
    const conversationId = (client.handshake as HandshakeWithAuth).auth
      .conversationId;
    const userId = (client.handshake as HandshakeWithAuth).auth.userId;
    try {
      if (!conversationId)
        throw new ArgumentError('No conversation to send message');

      const conversationIdConverted = new Types.ObjectId(conversationId);
      const data = CreateMessageSchema.parse({
        ...payload,
        conversationId: conversationIdConverted,
        author:
          payload.type === 'user' && payload.authorName && payload.authorNameEn
            ? { name: payload.authorName, nameEn: payload.authorNameEn, userId }
            : undefined,
      });

      const createdMessage = await this.chatsService.createAndSaveMessage(data);

      this.server
        .to(conversationId.toString())
        .emit('new-message', createdMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      client.emit('send-message-error', {
        message: (error as Error).message ?? 'Unexpected error',
      });
    }
  }

  @OnEvent('message.created')
  async handleMessageCreated(message: any) {
    this.server
      .to(message.conversationId.toString())
      .emit('new-message', message);
  }
}
