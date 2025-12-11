import { UseInterceptors } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RedisPropagatorInterceptor } from '@app/shared/redis-propagator/redis-propagator.interceptor';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  afterInit(): void {
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: any, ...args: any[]): void {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any): void {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('events')
  public findAllAbs(): Observable<any> {
    return from([1, 2, 3]).pipe(
      map(item => {
        return { event: 'events', data: item };
      }),
    );
  }
}
