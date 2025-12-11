import { BadRequestException, HttpException } from '@nestjs/common';
import { ZodError } from 'zod';

export function CatchToBadRequest(): MethodDecorator {
  return (_target, _propertyKey, descriptor: PropertyDescriptor) => {
    const original = descriptor.value as (...args: any[]) => any;

    descriptor.value = async function(...args: any[]) {
      try {
        return await original.apply(this, args);
      } catch (error) {
        if (error instanceof ZodError) {
          const issues = error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          }));

          const errorPaths = issues.map(issue => issue.path).join('\n');

          throw new BadRequestException({
            message: `Validation failed for:\n${errorPaths}`,
            issues,
          });
        }
        if (error instanceof HttpException) {
          throw error;
        }
        throw new BadRequestException(error?.message ?? 'Bad request');
      }
    };

    return descriptor;
  };
}
