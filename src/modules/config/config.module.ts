import configure from '@/configure';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from './services/config-service';

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(configure),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
