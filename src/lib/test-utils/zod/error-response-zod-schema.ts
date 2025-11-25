import { z } from 'zod';

export const ErrorResponseZSchema = z.object({
  statusCode: z.number(),
  message: z.union([z.string(), z.array(z.string())]),
  error: z.string(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseZSchema>;
