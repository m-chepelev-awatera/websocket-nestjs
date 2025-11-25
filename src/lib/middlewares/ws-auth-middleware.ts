import { AccessTokenRepository } from '@users/db/repositories/access-token-repository';
import { UnauthorizedException } from '@nestjs/common';
import { Socket } from 'socket.io';

type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

type HandshakeWithAuth = Socket['handshake'] & {
  auth: {
    token?: string;
  };
};

export const WsAuthMiddleware = (
  accessTokenRepository: AccessTokenRepository,
): SocketMiddleware => {
  return async (socket: Socket, next: (err?: Error) => void) => {
    try {
      const { token } = (socket.handshake as HandshakeWithAuth).auth;

      if (!token) {
        next(new UnauthorizedException('Unauthorized'));
        return;
      }

      const accessToken = await accessTokenRepository.findById(token);

      if (!accessToken) {
        throw new UnauthorizedException('Unauthorized');
      }

      const { isValid } = accessToken.checkValidity();

      if (!isValid) {
        throw new UnauthorizedException('Unauthorized');
      }

      next();
    } catch (error) {
      next(error as Error);
    }
  };
};
