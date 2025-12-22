import { Module, DynamicModule } from '@nestjs/common';

import { SharedModule } from './shared/shared.module';

import { DatabaseModule } from './database/database.module';
import { DatabaseTestingModule } from './database/database.testing.module';
import { ChatGateway } from './gateways/chat.getaway';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from '@/modules/users/user.module';

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
        EventEmitterModule.forRoot(),
        UserModule,
      ],
      controllers: [],
      providers: [ChatGateway],
    };
  }
}
