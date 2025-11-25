import { NestFactory } from '@nestjs/core';

import { initAdapters } from './app/adapters.init';
import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule.register({}));

  initAdapters(app);

  await app.listen(3000, () => {
    console.log(`Listening on port 3000.`);
  });
}

bootstrap();
