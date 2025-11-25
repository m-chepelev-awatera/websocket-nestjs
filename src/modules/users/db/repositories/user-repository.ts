import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseObjectIdLoopbackReadonlyRepository } from '@/lib/db/repositories/loopback/base-object-id-loopback-readonly-repository';

import { UserSchemaDefinition } from '@users/db/schemas/user-schema';
import { UserSchemaFactory } from '@users/db/schema-factories/user-schema-factory';

import {
  UserDomainModel,
  ensureUser,
} from '../../domain-models/user-domain-model';

@Injectable()
export class UserRepository extends BaseObjectIdLoopbackReadonlyRepository<
  UserDomainModel,
  UserSchemaDefinition
> {
  constructor(
    @InjectModel(UserSchemaDefinition.name)
    protected model: Model<UserSchemaDefinition>,
    protected schemaFactory: UserSchemaFactory,
  ) {
    super(model, schemaFactory, ensureUser);
  }

  async findByEmail(email: string) {
    const result = await this.model.find({ email });

    return this.toModels(result);
  }

  async findByUsername(username: string) {
    const result = await this.model.findOne({ username });

    return result ? this.toModel(result) : null;
  }
}
