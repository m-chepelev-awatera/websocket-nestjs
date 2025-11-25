import { notNullOrEmptyString } from '@lib/validation/validation.helpers';
import {
  BaseDomainModel,
  IBaseDomainModel,
} from '@/lib/db/domain-models/base.domain.model';

export interface IStringIdDomainModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  changeStamp: string;
}

export abstract class StringIdDomainModel extends BaseDomainModel<string> {
  protected constructor({
    id,
    createdAt,
    updatedAt,
    changeStamp,
  }: IBaseDomainModel<string>) {
    super(
      {
        id,
        createdAt,
        updatedAt,
        changeStamp,
      },
      notNullOrEmptyString,
    );
  }
}
