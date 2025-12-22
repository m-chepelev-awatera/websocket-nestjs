import { Types } from 'mongoose';
import {
  ensureObjectId,
  isNotRequired,
  ensureString,
  getEnsureCustom,
  getEnsureAll,
} from '@lib/validation/validation.helpers';

import {
  BaseObjectIdLoopbackDomainModel,
  IBaseObjectIdLoopbackDomainModel,
} from '@/lib/domain-models/base.objectId.loopback.domain.model';

export interface IUser extends IBaseObjectIdLoopbackDomainModel {
  username: string;
  password: string;
  email: string;
  groups?: string[];
  principalId?: Types.ObjectId;
}

export class UserDomainModel extends BaseObjectIdLoopbackDomainModel {
  private constructor({ ...data }: IUser) {
    super({ ...data });
    this.username = ensureString({ username: data.username });
    this.password = ensureString({ password: data.password });
    this.email = ensureString({ email: data.email });
    this.groups = isNotRequired(getEnsureAll(ensureString), {
      groups: data.groups ?? [],
    });
    this.principalId = data.principalId
      ? isNotRequired(ensureObjectId, {
          principalId: data.principalId,
        })
      : undefined;
  }

  public static Create(data: Partial<IUser>): UserDomainModel {
    const modifiedData = { ...data };
    modifiedData.id = data.id || new Types.ObjectId();
    modifiedData.deleted = data.deleted || false;
    modifiedData.modifiedDate = data.modifiedDate || new Date();
    return new UserDomainModel({ ...(modifiedData as IUser) });
  }

  public static CreateFromDatabase(dataFromDb: IUser): UserDomainModel {
    return new UserDomainModel(dataFromDb);
  }

  public readonly username: string;
  public readonly password: string;
  public readonly email: string;
  public readonly groups?: ReadonlyArray<string>;
  public readonly principalId?: Types.ObjectId;
}

export const ensureUser = getEnsureCustom(
  (dm: UserDomainModel) => dm instanceof UserDomainModel,
  `Not a valid ${UserDomainModel.name}`,
);
