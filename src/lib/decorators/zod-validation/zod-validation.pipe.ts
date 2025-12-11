import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }
    try {
      const result = this.schema.parse(value);
      return result;
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        }));

        const errorPaths = issues.map((issue) => issue.path).join('\n');

        throw new BadRequestException({
          message: `Validation failed for:\n${errorPaths}`,
          issues,
        });
      }

      throw error;
    }
  }
}
