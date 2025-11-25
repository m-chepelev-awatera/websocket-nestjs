import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@config/services/config-service';
import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';

@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    const db = MongooseModule.forRootAsync(getConnectionOptions());

    return {
      module: DatabaseModule,
      imports: [db],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}

export function getConnectionOptions() {
  return {
    connectionFactory: (connection) => {
      connection.on('connected', () => {
        console.log('is connected');
      });
      connection.on('disconnected', () => {
        console.log('DB disconnected');
      });
      connection.on('error', (error) => {
        console.log('DB connection failed! for error: ', error);
      });
      return connection;
    },

    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
      const config = configService.getConfig();
      const mongoUrl = config.mongo.url;
      if (!mongoUrl) {
        throw new Error('Mongo url is not set or injected');
      }
      return {
        autoIndex: !config.isProd,
        uri: mongoUrl,
      };
    },
    inject: [ConfigService],
  } as MongooseModuleAsyncOptions;
}
