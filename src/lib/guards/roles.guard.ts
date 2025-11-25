import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AccessControlService } from '@access-control/services/access-control.service';
import { UserRoles } from '@user-roles/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControlService: AccessControlService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { currentUserId } = request.headers;

    const userRoles = await this.accessControlService.getUserRoles(
      currentUserId,
    );

    request.headers.currentUserRoles = userRoles;

    let allowedRoles = this.reflector.get<UserRoles[]>(
      'roles',
      context.getHandler(),
    );

    if (!allowedRoles) {
      allowedRoles = this.reflector.get('roles', context.getClass());
    }
    if (!allowedRoles) {
      allowedRoles = [];
    }

    const hasAllowedRole = allowedRoles.some(role => userRoles.includes(role));

    if (!hasAllowedRole) {
      throw new ForbiddenException('Access restriction');
    }

    return true;
  }
}
