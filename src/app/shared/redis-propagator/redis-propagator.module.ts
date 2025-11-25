import { Module } from '@nestjs/common';

import { RedisModule } from '@app/shared/redis/redis.module';

import { RedisPropagatorService } from './redis-propagator.service';
import { SocketStateModule } from '../socket-state/socket-state.module';

@Module({
  imports: [RedisModule, SocketStateModule],
  providers: [RedisPropagatorService],
  exports: [RedisPropagatorService],
})
export class RedisPropagatorModule {}
