import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@config/services/config-service';

import {
  REDIS_PUBLISHER_CLIENT,
  REDIS_SUBSCRIBER_CLIENT,
} from './redis.constants';

export type RedisClient = Redis.Redis;

export const redisProviders: Provider[] = [
  {
    useFactory: (configService: ConfigService): RedisClient => {
      const { redis } = configService.getConfig();
      return new Redis({
        host: redis.host,
        port: redis.port,
        password: redis.password,
        connectTimeout: redis.connectTimeout,
      });
    },
    inject: [ConfigService],
    provide: REDIS_SUBSCRIBER_CLIENT,
  },
  {
    useFactory: (configService: ConfigService): RedisClient => {
      const { redis } = configService.getConfig();
      return new Redis({
        host: redis.host,
        port: redis.port,
        password: redis.password,
        connectTimeout: redis.connectTimeout,
      });
    },
    inject: [ConfigService],
    provide: REDIS_PUBLISHER_CLIENT,
  },
];
