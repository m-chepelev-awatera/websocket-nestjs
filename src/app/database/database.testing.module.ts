import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { DatabaseTestingService } from './database.testing.service';

let replica: MongoMemoryReplSet;

@Module({})
export class DatabaseTestingModule {
  static register(
    options: MongooseModuleOptions = { retryWrites: false },
  ): DynamicModule {
    // const isProduction = configure.isProd;

    // if (isProduction) {
    //   return {
    //     module: DatabaseTestingModule,
    //     imports: [DatabaseModule.register(configure.mongo.url, isProduction)],
    //     controllers: [],
    //     providers: [],
    //     exports: [],
    //   };
    // }

    return {
      module: DatabaseTestingModule,
      imports: [
        MongooseModule.forRootAsync({
          imports: [],
          useFactory: async () => {
            replica = await MongoMemoryReplSet.create({
              replSet: { count: 1 },
            });
            const mongoUri = replica.getUri();
            return {
              uri: mongoUri,
              ...options,
            };
          },
        }),
      ],
      controllers: [],
      providers: [DatabaseTestingService],
      exports: [DatabaseTestingService],
    };
  }
}

export const closeMongoConnection = async () => {
  if (replica) replica.stop();
  return null;
};
