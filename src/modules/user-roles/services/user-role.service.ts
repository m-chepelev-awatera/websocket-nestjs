import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { RoleRepository } from '@user-roles/db/repositories/role-repository';
import { RoleMappingRepository } from '@user-roles/db/repositories/role-mapping-repository';
import { RoleDomainModel } from '@user-roles/domain-models/role-domain-model';
import { UserRoles } from '@user-roles/types';

@Injectable()
export class UserRoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly roleMappingRepository: RoleMappingRepository,
  ) {}

  async getRoles(userModelId: Types.ObjectId): Promise<UserRoles[]> {
    const roleMappings = await this.roleMappingRepository.findByUserModelId(
      userModelId,
    );

    const roles: RoleDomainModel[] = [];

    for (const roleMapping of roleMappings) {
      if (roleMapping.roleId) {
        const role = await this.roleRepository.findById(roleMapping.roleId);
        if (!role) {
          throw new Error('Role not found');
        }
        roles.push(role);
      }
    }

    const roleNames = roles.map((role) => role.name);

    return roleNames;
  }
}
