import { Types } from 'mongoose';
import {
  ensureObjectId,
  ensurePositiveInteger,
  ensureValidDate,
  notNullOrEmptyString,
} from '@lib/validation/validation.helpers';

export interface IAccessToken {
  id: string;
  ttl: number;
  created: Date;
  userId: Types.ObjectId;
}

export class AccessTokenDomainModel {
  private constructor({ ...data }: IAccessToken) {
    this.id = notNullOrEmptyString({ id: data.id });
    this.ttl = ensurePositiveInteger({ ttl: data.ttl });
    this.created = ensureValidDate({ created: data.created });
    this.userId = ensureObjectId({ userId: data.userId });
  }

  public static Create(data: IAccessToken): AccessTokenDomainModel {
    return new AccessTokenDomainModel({ ...data });
  }

  public static CreateFromDatabase(
    dataFromDb: IAccessToken,
  ): AccessTokenDomainModel {
    return new AccessTokenDomainModel(dataFromDb);
  }

  checkValidity(): { isValid: boolean; userId: Types.ObjectId } {
    const ttlMilliseconds = (this.ttl || 0) * 1000;
    const createdMilliseconds = this.created.getTime();
    const isValid = createdMilliseconds + ttlMilliseconds > Date.now();

    return {
      isValid,
      userId: this.userId,
    };
  }

  public readonly id: string;
  public readonly ttl: number;
  public readonly created: Date;
  public readonly userId: Types.ObjectId;
}
