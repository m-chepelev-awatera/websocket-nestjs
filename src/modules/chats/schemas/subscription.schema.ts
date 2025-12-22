import { z } from 'zod';
import { BaseObjectIdModel } from '@/lib/domain-models/object.id.domain.model';
import { ObjectIdSchema } from '@/lib/zod-schemas/object-id-schema';

export const SubscriptionSchema = BaseObjectIdModel.extend({
  lastRead: z.date().optional(),
  hasUnreadTag: z.boolean().optional(),
  hasUnreadTeamTag: z.boolean().optional(),
  lastMessageText: z.string().optional(),
  conversationId: ObjectIdSchema,
  userId: ObjectIdSchema,
  isRead: z.boolean(),
  lastMessageDate: z.date().optional(),
  unreadMessagesCount: z.number(),
});

export type SubscriptionSchema = z.infer<typeof SubscriptionSchema>;
