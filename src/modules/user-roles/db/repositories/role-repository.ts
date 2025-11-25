import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';

import { getOriginalSchemaValues } from '@/lib/transforms/to-original-schema-data-type-values';
import { RoleSchemaDefinition } from '@user-roles/db/schemas/role-schema';
import { RoleSchemaFactory } from '@user-roles/db/schema-factories/role-schema-factory';
import { RoleDomainModel } from '@user-roles/domain-models/role-domain-model';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectModel(RoleSchemaDefinition.name)
    protected model: Model<RoleSchemaDefinition>,
    protected schemaFactory: RoleSchemaFactory,
  ) {}

  protected toModel(result: (mongoose.Document & RoleSchemaDefinition) | null) {
    return !result
      ? null
      : this.schemaFactory.createFromSchema(getOriginalSchemaValues(result));
  }

  protected toModels(
    result: (mongoose.Document[] & RoleSchemaDefinition[]) | [],
  ) {
    return result.map((singleSchemaInstance) =>
      this.schemaFactory.createFromSchema(
        getOriginalSchemaValues(singleSchemaInstance),
      ),
    );
  }

  async findById(id: string | Types.ObjectId): Promise<RoleDomainModel | null> {
    const result = await this.model.findById(id).exec();
    return this.toModel(result);
  }
}
