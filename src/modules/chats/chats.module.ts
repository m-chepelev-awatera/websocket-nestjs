import { Module } from '@nestjs/common';

import { ChatsController } from '@chats/api/chats.controlles';
import { ChatsService } from '@chats/services/chats.service';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
