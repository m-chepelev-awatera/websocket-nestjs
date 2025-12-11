import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Types } from 'mongoose';

export const SignedUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Types.ObjectId => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.headers.currentUserId;
    const isValidObjectId = Types.ObjectId.isValid(userId);
    if (!userId || !isValidObjectId) {
      throw new UnauthorizedException('No signed user in request');
    }
    return new Types.ObjectId(request.headers.currentUserId);
  },
);
