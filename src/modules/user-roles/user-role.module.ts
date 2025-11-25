import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  RoleSchema,
  RoleSchemaDefinition,
} from '@user-roles/db/schemas/role-schema';
import { RoleRepository } from '@user-roles/db/repositories/role-repository';
import { RoleSchemaFactory } from '@user-roles/db/schema-factories/role-schema-factory';
import { RoleMappingRepository } from '@user-roles/db/repositories/role-mapping-repository';
import { RoleMappingSchemaFactory } from '@user-roles/db/schema-factories/role-mapping-schema-factory';
import {
  RoleMappingSchema,
  RoleMappingSchemaDefinition,
} from '@user-roles/db/schemas/role-mapping-schema';
import { UserRoleService } from '@user-roles/services/user-role.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoleSchemaDefinition.name, schema: RoleSchema },
      { name: RoleMappingSchemaDefinition.name, schema: RoleMappingSchema },
    ]),
  ],
  providers: [
    RoleRepository,
    RoleSchemaFactory,
    RoleMappingRepository,
    RoleMappingSchemaFactory,
    UserRoleService,
  ],
  exports: [UserRoleService],
})
export class UserRoleModule {}
