import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { ChatsService } from '@chats/services/chats.service';
import { ZodValidationPipe } from '@/lib/decorators/zod-validation/zod-validation.pipe';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CatchToBadRequest } from '@/lib/decorators/catch-to-bad-request';
import { ValidateTokenGuard } from '@/lib/guards/validate-token.guard';
import { SignedUser } from '@/lib/decorators/signed-user.decorator';
import { SubcribeUserSchema } from '../schemas/subscribe-user.schema';
import { Types } from 'mongoose';
import { IdValidation } from '@/lib/decorators/id-validaton';
import { UnsubscribeUserSchema } from '../schemas/unsubscribe-user.schema';
import { UnsubscribeUserDto } from './dto/unsubscribe-user.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateMessageSchema } from '../schemas/message.schema';

@Controller('chats')
@UseGuards(ValidateTokenGuard)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post('create')
  @UsePipes(new ZodValidationPipe(CreateConversationDto))
  @CatchToBadRequest()
  create(@Body() dto: CreateConversationDto) {
    return this.chatsService.createConversation(dto);
  }

  @Post(':id/subscribe')
  @CatchToBadRequest()
  subscribe(
    @Param('id', IdValidation) id: Types.ObjectId,
    @SignedUser() userId: Types.ObjectId,
  ) {
    const data = SubcribeUserSchema.parse({
      conversationId: id,
      userId: userId,
    });

    return this.chatsService.subscribeToConversation(data);
  }

  @Delete(':id/unsubscribe')
  @UsePipes(new ZodValidationPipe(UnsubscribeUserDto))
  @CatchToBadRequest()
  unsubscribe(
    @Param('id', IdValidation) id: Types.ObjectId,
    @SignedUser() userId: Types.ObjectId,
    @Body() dto: UnsubscribeUserDto,
  ) {
    const data = UnsubscribeUserSchema.parse({
      subscriptionId: dto.subscriptionId,
      conversationId: id,
      userId: userId,
    });

    return this.chatsService.unsubscribeFromConversation(data);
  }

  @Get(':id/my-subscription')
  @CatchToBadRequest()
  findById(
    @Param('id', IdValidation) id: Types.ObjectId,
    @SignedUser() userId: Types.ObjectId,
  ) {
    const data = SubcribeUserSchema.parse({
      conversationId: id,
      userId: userId,
    });

    return this.chatsService.getMySubscription(data);
  }

  @Post(':id/send-message')
  @UsePipes(new ZodValidationPipe(SendMessageDto))
  @CatchToBadRequest()
  sendMessage(
    @Param('id', IdValidation) id: Types.ObjectId,
    @SignedUser() userId: Types.ObjectId,
    @Body() dto: SendMessageDto,
  ) {
    const data = CreateMessageSchema.parse({
      ...dto,
      conversationId: id,
      userId: userId,
      author:
        dto.type === 'user' && dto.authorName && dto.authorNameEn
          ? { name: dto.authorName, nameEn: dto.authorNameEn, userId }
          : undefined,
    });

    this.chatsService.sendMessage(data);
  }
}
