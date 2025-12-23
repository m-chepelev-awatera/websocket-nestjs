import { AccessTokenRepository } from '@users/db/repositories/access-token-repository';
import { UnauthorizedException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Types } from 'mongoose';
import { get } from 'lodash';

type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

export type HandshakeWithAuth = Socket['handshake'] & {
  auth: {
    token?: string;
    userId?: string;
    conversationId?: string;
  };
};

export const WsAuthMiddleware = (
  accessTokenRepository: AccessTokenRepository,
): SocketMiddleware => {
  return async (socket: Socket, next: (err?: Error) => void) => {
    try {
      const token = get(
        socket.handshake as HandshakeWithAuth,
        'auth.token',
        null,
      );

      if (!token) {
        next(new UnauthorizedException('Unauthorized'));
        return;
      }

      const accessToken = await accessTokenRepository.findById(token);

      if (!accessToken) {
        throw new UnauthorizedException('Unauthorized');
      }

      const { isValid, userId } = accessToken.checkValidity();

      if (!isValid) {
        throw new UnauthorizedException('Unauthorized');
      }

      const currentUserId = (socket.handshake as HandshakeWithAuth).auth.userId;

      if (currentUserId && currentUserId !== userId.toString()) {
        throw new UnauthorizedException('Unauthorized');
      }

      (socket.handshake as HandshakeWithAuth).auth.userId = userId.toString();

      const conversationId = (socket.handshake as HandshakeWithAuth).auth
        .conversationId;
      const isValidConversationId = conversationId
        ? Types.ObjectId.isValid(conversationId)
        : false;

      if (conversationId && !isValidConversationId) {
        throw new UnauthorizedException('Unauthorized');
      }

      next();
    } catch (error) {
      next(error as Error);
    }
  };
};
