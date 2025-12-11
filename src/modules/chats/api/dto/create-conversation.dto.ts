import { z } from 'zod';

export const CreateConversationDto = z.object({
  title: z
    .string()
    .min(1)
    .max(255),
});

export type CreateConversationDto = z.infer<typeof CreateConversationDto>;
