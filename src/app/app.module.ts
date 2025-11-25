import { Module, DynamicModule } from '@nestjs/common';

import { SharedModule } from './shared/shared.module';
import { EventsGateway } from './test.gateway';

import { DatabaseModule } from './database/database.module';
import { DatabaseTestingModule } from './database/database.testing.module';

interface IModuleOptions {
  isTestingModule?: boolean;
}

@Module({})
export class AppModule {
  static register(options: IModuleOptions): DynamicModule {
    const { isTestingModule = false } = options;

    return {
      module: AppModule,
      imports: [
        isTestingModule ? DatabaseTestingModule : DatabaseModule.register(),
        SharedModule,
      ],
      controllers: [],
      providers: [EventsGateway],
    };
  }
}
