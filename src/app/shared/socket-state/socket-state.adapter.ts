import { INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import socketio from 'socket.io';

import { RedisPropagatorService } from '@app/shared/redis-propagator/redis-propagator.service';

import { SocketStateService } from './socket-state.service';
import { Socket } from 'socket.io';

interface TokenPayload {
  readonly userId: string;
  readonly conversationId?: string;
}

export interface AuthenticatedSocket extends socketio.Socket {
  auth: TokenPayload | null;
}

export class SocketStateAdapter extends IoAdapter implements WebSocketAdapter {
  public constructor(
    app: INestApplicationContext,
    private readonly socketStateService: SocketStateService,
    private readonly redisPropagatorService: RedisPropagatorService,
  ) {
    super(app);
  }

  public create(
    port: number,
    options: socketio.ServerOptions,
  ): socketio.Server {
    const server = super.createIOServer(port, options);
    this.redisPropagatorService.injectSocketServer(server);

    // server.use(async (socket: AuthenticatedSocket, next) => {
    //   const token =
    //     socket.handshake.query?.token ||
    //     socket.handshake.headers?.authorization;

    //   if (!token) {
    //     socket.auth = null;

    //     // not authenticated connection is still valid
    //     // thus no error
    //     return next();
    //   }

    //   try {
    //     // fake auth
    //     socket.auth = {
    //       userId: '1234',
    //     };

    //     return next();
    //   } catch (e) {
    //     return next(e);
    //   }
    // });

    return server;
  }

  public bindClientConnect(server: socketio.Server, callback: Function): void {
    server.on('connection', (socket: Socket) => {
      if (socket.handshake.auth) {
        this.socketStateService.add(socket);

        socket.on('disconnect', () => {
          if (socket.handshake.auth !== null)
            this.socketStateService.remove(socket);
          socket.removeAllListeners('disconnect');
        });
      }

      callback(socket);
    });
  }
}
