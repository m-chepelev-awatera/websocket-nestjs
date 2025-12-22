import { RedisSocketEventEmitDTO } from './socket-event-emit.dto';

export class MessageEventEmitDTO extends RedisSocketEventEmitDTO {
  public readonly conversationId: string;
}
