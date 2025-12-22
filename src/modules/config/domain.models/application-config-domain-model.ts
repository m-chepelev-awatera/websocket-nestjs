import {
  ensurePositiveInteger,
  ensureValidBool,
} from '@/lib/validation/validation.helpers';
import { MongoConfigDomainModel } from '@config/domain.models/mongo-config-domain-model';
import { RedisConfigDomainModel } from '@config/domain.models/redis-config-domain-model';

export class ApplicationConfigDomainModel {
  constructor(env: NodeJS.ProcessEnv) {
    this.isProd = ensureValidBool({
      isProd: env.NODE_ENV === 'production' || false,
    });
    this.appPort = ensurePositiveInteger({
      appPort: parseInt(env.AS_PORT || '8443'),
    });
    this.mongo = new MongoConfigDomainModel(env);
    this.redis = new RedisConfigDomainModel(env);
  }

  public readonly isProd: boolean;
  public readonly appPort: number;
  public readonly mongo: MongoConfigDomainModel;
  public readonly redis: RedisConfigDomainModel;
}
