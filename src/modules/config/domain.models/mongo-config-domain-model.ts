import {
  isNotRequired,
  notNullOrEmptyString,
} from '@lib/validation/validation.helpers';

export class MongoConfigDomainModel {
  constructor(env: NodeJS.ProcessEnv) {
    this.url = isNotRequired(notNullOrEmptyString, {
      url:
        env.NODE_ENV === 'staging'
          ? (env.MONGODB_TEST_URI as string)
          : (env.MONGODB_URI as string),
    });
  }

  public readonly url?: string;
}
