import { ArgumentError } from '@/lib/errors/argument.error';
import { ConflictError } from '@/lib/errors/conflict.error';
import { InvalidOperationError } from '@/lib/errors/invalid.operation.error';
import { NotImplementedError } from '@/lib/errors/not-implemented-error';
import { NotFoundError } from '@/lib/errors/not.found.error';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  BadRequestException,
  NotFoundException,
  ConflictException,
  NotImplementedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ZodError } from 'zod';

@Injectable()
export class ErrorToExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger();
  constructor() {}

  private logException(
    exception: HttpException,
    context: ExecutionContext,
  ): void {
    const currentClass: string = context.getClass().name;
    const method: string = context.getHandler().name;
    const contextStr = `${currentClass}.${method}`;

    return this.logger.error(exception.message, exception.stack, contextStr);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        let exception: HttpException;
        if (err instanceof ArgumentError || err instanceof ZodError) {
          exception = new BadRequestException(err.message);
        } else if (err instanceof NotFoundError) {
          exception = new NotFoundException(err.message);
        } else if (err instanceof ConflictError) {
          exception = new ConflictException(err.message);
        } else if (err instanceof NotImplementedError) {
          exception = new NotImplementedException(err.message);
        } else if (err instanceof InvalidOperationError) {
          exception = new InternalServerErrorException(err.message);
        } else if (err instanceof HttpException) {
          exception = err;
        } else {
          exception = new HttpException('Internal server error', 500);
        }

        this.logException(exception, context);

        return throwError(() => exception);
      }),
    );
  }
}
