import { BaseObjectIdModel } from '@/lib/domain-models/object.id.domain.model';
import { z } from 'zod';

export const ConversationSchema = BaseObjectIdModel.extend({
  title: z.string(),
  archived: z.boolean(),
  pinnedMessageId: z.string().nullish(),
});

export type ConversationSchema = z.infer<typeof ConversationSchema>;
