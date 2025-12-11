import { z } from 'zod';
import { MessageSchema } from '@/modules/chats/schemas/message.schema';

export const SendMessageDto = MessageSchema.omit({
  conversationId: true,
  id: true,
  createdAt: true,
  updatedAt: true,
  edited: true,
  changeStamp: true,
  author: true,
}).merge(
  z.object({
    authorName: z.string().optional(),
    authorNameEn: z.string().optional(),
  }),
);

export type SendMessageDto = z.infer<typeof SendMessageDto>;
