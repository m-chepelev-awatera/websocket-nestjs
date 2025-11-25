import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { UserRoleService } from '@user-roles/services/user-role.service';
import { UserRoles } from '@user-roles/types';

@Injectable()
export class AccessControlService {
  constructor(private readonly userRoleService: UserRoleService) {}

  async getUserRoles(userModelId: Types.ObjectId): Promise<UserRoles[]> {
    const roles = await this.userRoleService.getRoles(userModelId);

    return [...roles];
  }
}
