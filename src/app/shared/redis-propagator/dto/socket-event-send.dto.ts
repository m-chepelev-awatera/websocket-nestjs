import { RedisSocketEventEmitDTO } from './socket-event-emit.dto';

export class RedisSocketEventSendDTO extends RedisSocketEventEmitDTO {
  public readonly socketId: string;
  public readonly userId?: string;
  public readonly conversationId?: string;
}
