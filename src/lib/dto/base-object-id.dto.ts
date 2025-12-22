import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

import { ObjectIdDomainModel } from '@lib/domain-models/object.id.domain.model';

export class BaseObjectIdDto<TDomainModel extends ObjectIdDomainModel> {
  constructor(model: TDomainModel) {
    this.id = model.id;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
    this.changeStamp = model.changeStamp;
  }

  @Expose({ name: 'id' })
  readonly id: Types.ObjectId;

  @Expose({ name: 'createdAt' })
  readonly createdAt: Date;

  @Expose({ name: 'updatedAt' })
  readonly updatedAt: Date;

  @Expose({ name: 'changeStamp' })
  readonly changeStamp: string;
}
