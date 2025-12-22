import {
  ensurePositiveInteger,
  notNullOrEmptyString,
} from '@lib/validation/validation.helpers';

export class RedisConfigDomainModel {
  constructor(env: NodeJS.ProcessEnv) {
    this.host = notNullOrEmptyString({
      host: env.REDIS_HOST || '',
    });
    this.port = ensurePositiveInteger({
      port: parseInt(env.REDIS_PORT || ''),
    });
    this.password = notNullOrEmptyString({
      password: env.REDIS_PASSWORD || '',
    });
    this.connectTimeout = ensurePositiveInteger({
      connectTimeout: parseInt(env.REDIS_CONNECT_TIMEOUT || ''),
    });
  }

  public readonly host: string;
  public readonly port: number;
  public readonly password: string;
  public readonly connectTimeout: number;
}
