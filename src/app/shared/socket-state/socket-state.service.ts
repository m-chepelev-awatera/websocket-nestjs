import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { get, flatten } from 'lodash';
import { InvalidOperationError } from '@/lib/errors/invalid.operation.error';
import { ensureIsObjectIdOrHexString } from '@/lib/validation/validation.helpers';
@Injectable()
export class SocketStateService {
  private conversationSids = new Map<string, string[]>();
  private userSids = new Map<string, string[]>();

  public remove(socket: Socket): boolean {
    const userId = get(socket.handshake, 'auth.userId', null);
    const conversationId = get(socket.handshake, 'auth.conversationId', null);

    if (!userId || !conversationId)
      throw new InvalidOperationError(
        'Socket has no userId or conversationId in auth handshake',
      );

    if (userId) {
      ensureIsObjectIdOrHexString({ userId });
      const allUserSockets = this.userSids.get(userId) || [];
      const userSocketsWithoutCurrentSocket = allUserSockets.filter(
        sid => sid !== socket.id,
      );

      if (!userSocketsWithoutCurrentSocket.length) {
        this.userSids.delete(userId);
      } else {
        this.userSids.set(userId, userSocketsWithoutCurrentSocket);
      }
    }

    if (conversationId) {
      ensureIsObjectIdOrHexString({ conversationId });
      const allConversationSockets =
        this.conversationSids.get(conversationId) || [];
      const conversationSocketsWithoutCurrentSocket = allConversationSockets.filter(
        sid => sid !== socket.id,
      );

      if (!conversationSocketsWithoutCurrentSocket.length) {
        this.conversationSids.delete(conversationId);
      } else {
        this.conversationSids.set(
          conversationId,
          conversationSocketsWithoutCurrentSocket,
        );
      }
    }

    return true;
  }

  public add(socket: Socket): boolean {
    const userId = get(socket.handshake, 'auth.userId', null);
    const conversationId = get(socket.handshake, 'auth.conversationId', null);

    if (!userId || !conversationId)
      throw new InvalidOperationError(
        'Socket has no userId or conversationId in auth handshake',
      );

    if (userId) {
      ensureIsObjectIdOrHexString({ userId });
      const existingUserSockets = this.userSids.get(userId) || [];
      const userSockets = [...existingUserSockets, socket.id];
      this.userSids.set(userId, userSockets);
    }

    if (conversationId) {
      ensureIsObjectIdOrHexString({ conversationId });
      const existingConversationSockets =
        this.conversationSids.get(conversationId) || [];
      const conversationSockets = [...existingConversationSockets, socket.id];
      this.conversationSids.set(conversationId, conversationSockets);
    }

    return true;
  }

  public getUserSids(userId: string): string[] {
    return this.userSids.get(userId) || [];
  }

  public getConversationSIds(conversationId: string): string[] {
    return this.conversationSids.get(conversationId) || [];
  }

  public getAllUserSids(): string[] {
    return flatten(Array.from(this.userSids.values()));
  }

  public getAllConversationSids(): string[] {
    return flatten(Array.from(this.conversationSids.values()));
  }
}
