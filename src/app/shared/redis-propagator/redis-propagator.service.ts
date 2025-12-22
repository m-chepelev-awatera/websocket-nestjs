import { Injectable } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Server } from 'socket.io';
import { get } from 'lodash';
import { RedisService } from '@app/shared/redis/redis.service';
import { SocketStateService } from '@app/shared/socket-state/socket-state.service';
import { RedisSocketEventSendDTO } from './dto/socket-event-send.dto';
import {
  REDIS_SOCKET_EVENT_EMIT_TO_CONVERSATION,
  REDIS_SOCKET_EVENT_NOTIFY_USER,
} from './redis-propagator.constants';

@Injectable()
export class RedisPropagatorService {
  private socketServer: Server;

  public constructor(
    private readonly socketStateService: SocketStateService,
    private readonly redisService: RedisService,
  ) {
    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_EMIT_TO_CONVERSATION)
      .pipe(tap(this.consumeConversationMessageEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_NOTIFY_USER)
      .pipe(tap(this.consumeUserNotificationEvent))
      .subscribe();
  }

  public injectSocketServer(server: Server): RedisPropagatorService {
    this.socketServer = server;

    return this;
  }

  private consumeConversationMessageEvent = (
    eventInfo: RedisSocketEventSendDTO,
  ): void => {
    const conversationId = get(eventInfo, 'conversationId', null);
    if (!conversationId) return;
    const { event, data } = eventInfo;
    return this.socketStateService
      .getConversationSIds(conversationId)
      .forEach(sid => this.socketServer.to(sid).emit(event, data));
  };

  private consumeUserNotificationEvent = (
    eventInfo: RedisSocketEventSendDTO,
  ): void => {
    const userId = get(eventInfo, 'userId', null);
    if (!userId) return;
    const { event, data } = eventInfo;
    return this.socketStateService
      .getUserSids(userId)
      .forEach(sid => this.socketServer.to(sid).emit(event, data));
  };

  public propagateEvent(eventInfo: RedisSocketEventSendDTO): boolean {
    if (!eventInfo.userId && !eventInfo.conversationId) {
      return false;
    }

    if (eventInfo.conversationId) {
      this.emitToConversation(eventInfo);
    } else {
      this.notifyUser(eventInfo);
    }

    return true;
  }

  private emitToConversation(eventInfo: RedisSocketEventSendDTO): boolean {
    this.redisService.publish(
      REDIS_SOCKET_EVENT_EMIT_TO_CONVERSATION,
      eventInfo,
    );
    return true;
  }

  public notifyUser(eventInfo: RedisSocketEventSendDTO): boolean {
    this.redisService.publish(REDIS_SOCKET_EVENT_NOTIFY_USER, eventInfo);

    return true;
  }
}
