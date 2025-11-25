import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

import { REDIS_PUBLISHER_CLIENT, REDIS_SUBSCRIBER_CLIENT } from './redis.constants';

export type RedisClient = Redis.Redis;

export const redisProviders: Provider[] = [
  {
    useFactory: (): RedisClient => {
      return new Redis({
        host: '127.0.0.1',
        port: 6379,
        password: '1eab8833e44a77959a27e0cde0f391b5ce3634c6',
        connectTimeout: 30000,
      });
    },
    provide: REDIS_SUBSCRIBER_CLIENT,
  },
  {
    useFactory: (): RedisClient => {
      return new Redis({
        host: '127.0.0.1',
        port: 6379,
        password: '1eab8833e44a77959a27e0cde0f391b5ce3634c6',
        connectTimeout: 30000,
      });
    },
    provide: REDIS_PUBLISHER_CLIENT,
  },
];
