import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@/app/app.module';
import { ErrorToExceptionInterceptor } from '@/app/interceptors/error-to-exception.interceptor';

export const initTestApp = async (): Promise<INestApplication> => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule.register({ isTestingModule: true })],
  }).compile();

  const app: INestApplication = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ErrorToExceptionInterceptor());

  await app.init();

  return app;
};
