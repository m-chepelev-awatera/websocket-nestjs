import { RedisSocketEventEmitDTO } from './socket-event-emit.dto';

export class NotificationEventEmitDTO extends RedisSocketEventEmitDTO {
  public readonly userId: string;
}
